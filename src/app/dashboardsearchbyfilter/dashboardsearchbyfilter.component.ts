import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { UserService } from '../AppRestCall/user/user.service';
import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { config } from '../appconstants/config';
import { AlertsService } from '../AppRestCall/alerts/alerts.service';
import { UserAdapter } from '../adapters/useradapter';
import { MouseEvent } from '@agm/core';
import { UsersrvdetailsService } from '../AppRestCall/userservice/usersrvdetails.service';

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
  startdateForjob: Date;
  enddateForjob: Date;
  startDateForJob = new Date();
  endDateForJob = new Date();
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


  constructor(
    private route: ActivatedRoute,
    public userService: UserService,
    private spinnerService: Ng4LoadingSpinnerService,
    private alertService: AlertsService,
    private userAdapter: UserAdapter,
    private usersrvDetails: UsersrvdetailsService
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
    this.setFUMinStartDateToSearch();
    this.searchResults(null);
  }

  openCreateJobInterface() {
    this.iscreatejobdiv = true;
    this.startdateForjob = this.startDate;
  }

  backToSearch() {
    this.iscreatejobdiv = false;
    this.issearchbydate = false;
  }

  setFUMinStartDateToSearch() {
    var minStartDate = new Date();
    minStartDate.setDate(minStartDate.getDate() + 1);
    var dd = minStartDate.getDate();
    var mm = minStartDate.getMonth() + 1;
    var y = minStartDate.getFullYear();
    var startDtFmt = mm + '/' + dd + '/' + y + ' 10:00';
    this.startDate = new Date(startDtFmt);
  }

  searchByFilterFreelancer(startdate: Date) {
    this.iscreatejobdiv = false;
    this.timelaps = false;
    if (Object.prototype.toString.call(startdate) === '[object Date]') {
      this.usersrvDetails.getAllUserServiceDetailsByUserId(this.userService.currentUserValue.userId).subscribe(
        (listofusersrvDetails: any) => {
          if (listofusersrvDetails != null) {
            listofusersrvDetails.forEach((element: any) => {
              if (element.category === config.category_code_FS_S && element.isservicepurchased
                && this.getDateFormat(element.serviceendon) > this.getDateFormat(new Date())) {
                this.isfreelancerservicesubscribed = true;
                this.userFUObjList = [];
                this.searchResults(startdate);
              }
            });
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

  createJobInit() {
    var minStartDate = new Date();
    minStartDate.setDate(minStartDate.getDate() + 1);
    var dd = minStartDate.getDate();
    var mm = minStartDate.getMonth() + 1;
    var y = minStartDate.getFullYear();
    var startDtFmt = mm + '/' + dd + '/' + y + ' 10:00:00';
    this.startDateForJob = new Date(startDtFmt);

    var maxStartDate = new Date();
    maxStartDate.setDate(maxStartDate.getDate() + 2);
    var dd = maxStartDate.getDate();
    var mm = maxStartDate.getMonth() + 1;
    var y = maxStartDate.getFullYear();
    var endDtFmt = mm + '/' + dd + '/' + y + ' 10:00:00';
    this.endDateForJob = new Date(endDtFmt);

  }

  onChangeEndDateCalcHours() {
    if (this.startdateForjob != null && this.enddateForjob != null) {
      if (new Date(this.getDateTimeFormat(this.startdate)) >= new Date(this.getDateTimeFormat(this.enddateForjob))) {
        this.alertService.error('Start Date can not equal same datetime or greater than the End Date');
        this.maxHours = null;
        this.startdate = null;
      } else {
        this.maxHours = this.getHrBetweenDate(this.startdateForjob, this.enddateForjob);
      }
    } else {
      this.maxHours = null;
    }
  }

  private getHrBetweenDate(stDate: Date, eDate: Date) {
    this.actDate = new Date(this.startdateForjob);
    this.purchaseDate = new Date(this.enddateForjob);
    this.diffMs = (this.purchaseDate - this.actDate); // milliseconds
    let diffDays = Math.floor(this.diffMs / 86400000); // days
    let diffHrs = Math.floor((this.diffMs % 86400000) / 3600000); // hours
    let diffMins = Math.round(((this.diffMs % 86400000) % 3600000) / 60000); // minutes
    if (diffDays > 0) {
      return diffDays * 24;
    } else {
      return diffHrs;
    }
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
}

// just an interface for type safety.
interface marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}
