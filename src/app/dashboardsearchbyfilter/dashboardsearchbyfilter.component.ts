import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { UserService } from '../AppRestCall/user/user.service';
import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { config } from '../appconstants/config';
import { AlertsService } from '../AppRestCall/alerts/alerts.service';
import { UserAdapter } from '../adapters/useradapter';
import { MouseEvent } from '@agm/core';
import { UsersrvdetailsService } from '../AppRestCall/userservice/usersrvdetails.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FreelanceserviceService } from '../AppRestCall/freelanceservice/freelanceservice.service';
import { ReferenceService } from '../AppRestCall/reference/reference.service';
import { ApiService, Maps } from '../adapters/api.service';

@Component({
  selector: 'app-dashboardsearchbyfilter',
  templateUrl: './dashboardsearchbyfilter.component.html',
  styleUrls: ['./dashboardsearchbyfilter.component.css']
})
export class DashboardsearchbyfilterComponent implements OnInit {

  @ViewChild('search', null)
  public searchElementRef: ElementRef;

  startDate = new Date();
  startdate: Date;
  issearchbydate = false;
  markPoints: any;
  fulladdress: string;
  isfreelancerservicesubscribed = false;
  diffMs: any;
  actDate: any;
  purchaseDate: any;
  maxHours = 0;
  code: string;
  name: string;
  searchbyfiltername: string;
  userFUObjList: any = [];
  timelaps = false;
  iscreatejobdiv = false;
  // google maps zoom level
  zoom: number = 11;
  markers: marker[] = [];
  enddatevalue: string;
  listofhourlyRateDetailsoffus: any = [];
  avgHourlyRate: number;
  createjobform: FormGroup;
  searchform: FormGroup;
  issubmit = false;
  serviceId: number;
  route: string;
  city: string = null;
  state: string;
  country: string;
  shortAddress: string;
  lat: number;
  lng: number;
  cityElementOne: string;
  cityElementTwo: string;
  bufferhours: number = 4;

  constructor(
    private routeA: ActivatedRoute,
    public userService: UserService,
    private spinnerService: Ng4LoadingSpinnerService,
    private alertService: AlertsService,
    private userAdapter: UserAdapter,
    private usersrvDetails: UsersrvdetailsService,
    private formBuilder: FormBuilder,
    private freelanceserviceService: FreelanceserviceService,
    private referService: ReferenceService,
    private router: Router,
    private ngZone: NgZone,
    public apiService: ApiService,
  ) {
    setTimeout(() => {
      this.apiService.api.then(maps => {
        this.initAutocomplete(maps);
      });
    }, 2000);
    routeA.params.subscribe(params => {
      this.code = params.code;
      this.name = params.name;
      this.searchbyfiltername = params.filtername;
    });
  }

  mapClicked($event: MouseEvent) {
    this.markers.push({
      lat: $event.coords.lat,
      lng: $event.coords.lng,
      draggable: true
    });
  }

  ngOnInit() {
    this.isfreelancerservicesubscribed = false;
    this.searchResults(null);
    this.createFormValidation();
    this.searchFormValidation();
  }
  searchFormValidation() {
    this.searchform = this.formBuilder.group({
      startdate: ['', [Validators.required]],
      fulladdress: ['', [Validators.required]],
    });
  }
  createFormValidation() {
    this.createjobform = this.formBuilder.group({
      totalhoursofjob: ['', [Validators.required, Validators.maxLength(2), Validators.pattern('^[0-9]*$')]],
      jobendedon: [''],
      jobstartedon: [''],
      amount: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      jobdescription: ['', [Validators.required]],
      joblocation: ['', [Validators.required]],
      userId: this.userService.currentUserValue.userId,
      subcategory: this.code,
      updatedby: this.userService.currentUserValue.fullname,
      serviceId: [''],
      status: ['']
    });
  }

  initAutocomplete(maps: Maps) {
    let autocomplete = new maps.places.Autocomplete(this.searchElementRef.nativeElement);
    autocomplete.addListener('place_changed', () => {
      this.ngZone.run(() => {
        this.route = null;
        this.city = null;
        this.state = null;
        this.country = null;
        this.shortAddress = null;
        this.lng = -1;
        this.lat = -1;
        const place = autocomplete.getPlace();
        this.lat = place.geometry.location.lat();
        this.lng = place.geometry.location.lng();
        autocomplete.getPlace().address_components.forEach(element => {
          if (element.types[0] === 'route') {
            this.route = element.long_name;
          }
          if (element.types[0] === 'locality') {
            this.cityElementOne = element.long_name;
          } else
            if (element.types[0] === 'administrative_area_level_2') {
              this.cityElementTwo = element.long_name;
            }
          if (element.types[0] === 'administrative_area_level_1') {
            this.state = element.long_name;
          }
          if (element.types[0] === 'country') {
            this.country = element.short_name;
          }
        });
        this.route = this.route != null ? this.route : '';
        this.city = this.cityElementOne != null ? this.cityElementOne : this.cityElementTwo;
        let routeDup = this.route.length > 0 ? this.route + ',' : '';
        let cityDup = this.city.length > 0 ? this.city + ',' : '';
        let stateDup = this.state.length > 0 ? this.state + ',' : '';
        let countryDup = this.country.length > 0 ? this.country + ',' : '';
        this.shortAddress = routeDup + cityDup + stateDup + countryDup;
      });
    });
  }
  preparetosavefreelanceonservice() {
    this.issubmit = true;
    if (this.createjobform.invalid) {
      return;
    }
    if (this.createjobform.get('amount').value >= this.avgHourlyRate) {
      this.spinnerService.show();
      this.referService.getReferenceLookupByShortKey(config.fu_job_created_shortkey.toString()).subscribe(
        refCode => {
          this.createjobform.patchValue({ status: refCode });
          this.freelanceserviceService.saveFreelancerOnService(this.createjobform.value).subscribe((obj: any) => {
            if (obj.jobId > 0) {
              this.spinnerService.hide();
              this.router.navigate(['/job']);
              this.alertService.success('Job Id : ' + obj.jobId + ' is created successfully ');
            }
          },
            error => {
              this.spinnerService.hide();
              this.alertService.error(error);
            });
        },
        error => {
          this.spinnerService.hide();
          this.alertService.error(error);
        });
    } else {
      // tslint:disable-next-line: max-line-length
      this.alertService.error('The amount ' + this.createjobform.get('amount').value + ' is must greater than ' + this.avgHourlyRate);
    }
  }

  openCreateJobInterface() {
    this.usersrvDetails.getAllUserServiceDetailsByUserId(this.userService.currentUserValue.userId).subscribe(
      (listofusersrvDetails: any) => {
        if (listofusersrvDetails != null) {
          listofusersrvDetails.forEach((element: any) => {
            if (element.category === config.category_code_FS_S && element.isservicepurchased
              && this.getDateFormat(element.serviceendon) > this.getDateFormat(new Date())) {
              this.isfreelancerservicesubscribed = true;
              this.createjobform.patchValue({ serviceId: element.serviceId });
            }
          });
          this.createjobform.patchValue({ jobstartedon: this.getDateTimeFormat(this.startdate) });
        }
        if (this.isfreelancerservicesubscribed) {
          this.iscreatejobdiv = true;
        }
        if (!this.isfreelancerservicesubscribed) {
          // tslint:disable-next-line: max-line-length
          let errorMsg = 'Please purchase Freelancer Service , before you create a job for ' + this.name;
          this.alertService.error(errorMsg);
        }
      },
      error => {
        this.alertService.error(error);
        this.spinnerService.hide();
      });
  }

  backToSearch() {
    this.iscreatejobdiv = false;
    this.issearchbydate = false;
    setTimeout(() => {
      this.apiService.api.then(maps => {
        this.initAutocomplete(maps);
      });
    }, 2000);
  }

  setDefaultTimeForStartDate(st: Date) {
    st.setDate(st.getDate());
    var dd = st.getDate();
    var mm = st.getMonth() + 1;
    var y = st.getFullYear();
    var startDtFmt = mm + '/' + dd + '/' + y + ' 10:00';
    st = new Date(startDtFmt);
    return st;
  }

  get f() {
    return this.createjobform.controls;
  }
  get s() {
    return this.searchform.controls;
  }

  addHoursToJobStartDateAndMinMaxAmount(event: any) {
    var hours = event.target.value;
    var totalhours = (Number.parseInt(hours) + this.bufferhours);
    console.log('this is total hours :', totalhours);
    var jobEndDate = new Date();
    jobEndDate.setTime(this.startdate.getTime() + (totalhours * 60 * 60 * 1000));
    var dd = jobEndDate.getDate();
    var mm = jobEndDate.getMonth() + 1;
    var y = jobEndDate.getFullYear();
    var hr = jobEndDate.getHours();
    var min = jobEndDate.getMinutes();
    var month = mm > 10 ? mm : '0' + mm;
    var day = dd > 10 ? dd : '0' + dd;
    var mins = min > 10 ? min : '0' + min;
    var addedhourstodate = y + '-' + month + '-' + day + ' ' + hr + ':' + mins;
    this.enddatevalue = addedhourstodate;
    this.listofhourlyRateDetailsoffus = [];
    if (this.userFUObjList != null) {
      this.userFUObjList.forEach(element => {
        this.listofhourlyRateDetailsoffus.push(element.hourlyRate);
      });
      var maxAmt = Math.max.apply(null, this.listofhourlyRateDetailsoffus);
      var minAmt = Math.min.apply(null, this.listofhourlyRateDetailsoffus);
      var maxHourlyRate = maxAmt * hours;
      var minHourlyRate = minAmt * hours;
      this.avgHourlyRate = maxHourlyRate / minHourlyRate;
      this.createjobform.patchValue({ jobendedon: this.enddatevalue });
    }
  }

  getDateFormat(dt: Date) {
    var date = new Date(dt);
    var year = date.getFullYear();
    var tempmonth = date.getMonth() + 1; //getMonth is zero based;
    var tempday = date.getDate();
    var hr = date.getHours();
    var tempmin = date.getMinutes();
    var month = tempmonth > 10 ? tempmonth : '0' + tempmonth;
    var day = tempday > 10 ? tempday : '0' + tempday;
    var formatted = year + '-' + month + '-' + day;
    return formatted;
  }


  getDateTimeFormat(dt: Date) {
    var date = new Date(dt);
    var year = date.getFullYear();
    var tempmonth = date.getMonth() + 1; //getMonth is zero based;
    var tempday = date.getDate();
    var hr = date.getHours();
    var tempmin = date.getMinutes();
    var month = tempmonth > 10 ? tempmonth : '0' + tempmonth;
    var day = tempday > 10 ? tempday : '0' + tempday;
    var min = tempmin > 10 ? tempmin : '0' + tempmin;
    var formatted = year + '-' + month + '-' + day + ' ' + hr + ':' + min;
    return formatted;
  }

  /* Search Functionality is below */
  searchByFilterFreelancer() {
    this.issubmit = true;
    if (this.searchform.invalid) {
      return;
    }
    this.createjobform.patchValue({ joblocation: this.searchElementRef.nativeElement.value });
    this.searchform.patchValue({ fulladdress: this.searchElementRef.nativeElement.value });
    this.iscreatejobdiv = false;
    this.timelaps = false;
    this.enddatevalue = null;
    this.searchResults(this.searchform.get('startdate').value);
    this.startdate = this.setDefaultTimeForStartDate(this.searchform.get('startdate').value);
  }
  searchResults(startdate: Date) {
    this.issearchbydate = false;
    this.timelaps = false;
    this.markPoints = [];
    this.markers = [];
    if (this.searchbyfiltername === config.search_byfilter_fu.toString() &&
      this.userService.currentUserValue.userroles.rolecode === config.user_rolecode_cba.toString()) {
      if (startdate === null) {
        this.spinnerService.show();
        this.userFUObjList = [];
        this.userService.getUserDetailsByJobAvailable().subscribe(
          (userObjList: any) => {
            setTimeout(() => {
              userObjList.forEach(element => {
                this.setuserObjList(element);
              });
              this.timelaps = true;
              this.spinnerService.hide();
            }, 1000);
          },
          error => {
            this.spinnerService.hide();
            this.alertService.error(error);
          });
      } else {
        this.spinnerService.show();
        let sdate = this.getDateFormat(startdate);
        this.userService.getUserDetailsByJobAvailableByCreateOn(sdate, this.code).subscribe(
          (userObjList: any) => {
            this.userFUObjList = [];
            setTimeout(() => {
              userObjList.forEach(element => {
                console.log('this.city', this.city);
                if (this.city !== null) {
                  if (element.city === this.city) {
                    this.setuserObjList(element);
                  }
                }
              });
              this.issearchbydate = true;
              this.spinnerService.hide();
              this.timelaps = true;
            }, 1000);
          },
          error => {
            this.spinnerService.hide();
            this.alertService.error(error);
          });
      }
    }
  }
  setuserObjList(element: any) {
    if (element.subCategory === this.code) {
      if (element.starRate != null) {
        element.starRate = Array(element.starRate);
      }
      this.userFUObjList.push(element);
      this.markPoints = {
        lat: element.lat,
        lng: element.lng,
        label: element.fullname,
        draggable: false,
        shortaddress: element.shortaddress,
        abt: element.abt,
        avtarurl: element.avtarurl
      };
      this.markers.push(this.markPoints);
    }
  }
}

// just an interface for type safety.
interface marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}
