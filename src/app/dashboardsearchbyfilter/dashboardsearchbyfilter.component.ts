import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { UserService } from '../AppRestCall/user/user.service';
import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { config } from '../appconstants/config';
import { AlertsService } from '../AppRestCall/alerts/alerts.service';
import { UserAdapter } from '../adapters/useradapter';
import { MouseEvent } from '@agm/core';
import { UsersrvdetailsService } from '../AppRestCall/userservice/usersrvdetails.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FreelanceserviceService } from '../AppRestCall/freelanceservice/freelanceservice.service';
import { ReferenceService } from '../AppRestCall/reference/reference.service';

@Component({
  selector: 'app-dashboardsearchbyfilter',
  templateUrl: './dashboardsearchbyfilter.component.html',
  styleUrls: ['./dashboardsearchbyfilter.component.css']
})
export class DashboardsearchbyfilterComponent implements OnInit {

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
  issubmit = false;
  serviceId: number;
  constructor(
    private route: ActivatedRoute,
    public userService: UserService,
    private spinnerService: Ng4LoadingSpinnerService,
    private alertService: AlertsService,
    private userAdapter: UserAdapter,
    private usersrvDetails: UsersrvdetailsService,
    private formBuilder: FormBuilder,
    private freelanceserviceService: FreelanceserviceService,
    private referService: ReferenceService,
    private router: Router,
  ) {
    route.params.subscribe(params => {
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
    this.fulladdress = this.userService.currentUserValue.userbizdetails.fulladdress;
    this.searchResults(null);
    this.createFormValidation();
  }

  createFormValidation() {
    this.createjobform = this.formBuilder.group({
      totalhoursofjob: ['', [Validators.required, Validators.maxLength(2), Validators.pattern('^[0-9]*$')]],
      jobendedon: [''],
      jobstartedon: [''],
      amount: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      jobdescription: ['', [Validators.required]],
      joblocation: this.userService.currentUserValue.userbizdetails.fulladdress,
      userId: this.userService.currentUserValue.userId,
      subcategory: this.code,
      updatedby: this.userService.currentUserValue.fullname,
      serviceId: [''],
      status: ['']
    });
  }

  preparetosavefreelanceonservice() {
    this.issubmit = true;
    if (this.createjobform.invalid) {
      return;
    }
    if (this.createjobform.get('amount').value >= this.avgHourlyRate ) {
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
    this.iscreatejobdiv = true;
  }

  backToSearch() {
    this.iscreatejobdiv = false;
    this.issearchbydate = false;
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

  addHoursToJobStartDateAndMinMaxAmount(event: any) {
    let hours = event.target.value;
    var jobEndDate = new Date();
    jobEndDate.setTime(this.startdate.getTime() + (hours * 60 * 60 * 1000));
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



  searchByFilterFreelancer(startdate: Date) {
    if (Object.prototype.toString.call(startdate) === '[object Date]') {
      this.iscreatejobdiv = false;
      this.timelaps = false;
      this.enddatevalue = null;
      this.usersrvDetails.getAllUserServiceDetailsByUserId(this.userService.currentUserValue.userId).subscribe(
        (listofusersrvDetails: any) => {
          if (listofusersrvDetails != null) {
            listofusersrvDetails.forEach((element: any) => {
              if (element.category === config.category_code_FS_S && element.isservicepurchased
                && this.getDateFormat(element.serviceendon) > this.getDateFormat(new Date())) {
                this.isfreelancerservicesubscribed = true;
                this.userFUObjList = [];
                this.searchResults(startdate);
                this.startdate = this.setDefaultTimeForStartDate(startdate);
                this.createjobform.patchValue({ serviceId: element.serviceId });
              }
            });
            this.createjobform.patchValue({ jobstartedon: this.getDateTimeFormat(this.startdate) });
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
    } else {
      this.alertService.error('Please select job create date your looking.');
    }
  }
  searchResults(startdate: Date) {
    this.issearchbydate = false;
    this.timelaps = false;
    this.markPoints = [];
    this.markers = [];
    if (this.searchbyfiltername === config.search_byfilter_fu.toString() &&
      this.userService.currentUserValue.userroles.rolecode === config.user_rolecode_cba.toString() ||
      this.userService.currentUserValue.userroles.rolecode === config.user_rolecode_csct.toString() ||
      this.userService.currentUserValue.userroles.rolecode === config.user_rolecode_cscm.toString()) {
      if (startdate === null) {
        this.spinnerService.show();
        this.userService.getUserDetailsByJobAvailable().subscribe(
          (userObjList: any) => {
            this.setuserObjList(userObjList);
            this.timelaps = true;
            this.spinnerService.hide();
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
            this.setuserObjList(userObjList);
            this.timelaps = true;
            this.issearchbydate = true;
            this.spinnerService.hide();
          },
          error => {
            this.spinnerService.hide();
            this.alertService.error(error);
          });
      }
    }
  }
  setuserObjList(userObjList: any) {
    userObjList.forEach(element => {
      if (element.subCategory === this.code &&
        element.city === this.userService.currentUserValue.userbizdetails.city) {
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
    });
  }
}

// just an interface for type safety.
interface marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}
