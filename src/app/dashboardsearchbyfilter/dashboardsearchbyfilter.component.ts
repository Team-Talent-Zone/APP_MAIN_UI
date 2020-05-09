import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { UserService } from '../AppRestCall/user/user.service';
import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { config } from '../appconstants/config';
import { AlertsService } from '../AppRestCall/alerts/alerts.service';
import { UserAdapter } from '../adapters/useradapter';
import { MouseEvent } from '@agm/core';

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

  constructor(
    private route: ActivatedRoute,
    public userService: UserService,
    private spinnerService: Ng4LoadingSpinnerService,
    private alertService: AlertsService,
    private userAdapter: UserAdapter,

  ) {
    route.params.subscribe(params => {
      this.code = params.code;
      this.name = params.name;
      this.searchbyfiltername = params.filtername;
    });
  }

  code: string;
  name: string;
  searchbyfiltername: string;
  userFUObjList: any = [];
  timelaps = false;

  // google maps zoom level
  zoom: number = 11;

  markers: marker[] = [];

  mapClicked($event: MouseEvent) {
    this.markers.push({
      lat: $event.coords.lat,
      lng: $event.coords.lng,
      draggable: true
    });
  }

  ngOnInit() {
    this.setFUMinStartDateToSearch();
    this.searchResults(null);
  }

  setFUMinStartDateToSearch() {
    var minStartDate = new Date();
    minStartDate.setDate(minStartDate.getDate() + 1);
    var dd = minStartDate.getDate();
    var mm = minStartDate.getMonth() + 1;
    var y = minStartDate.getFullYear();
    var startDtFmt = mm + '/' + dd + '/' + y;
    this.startDate = new Date(startDtFmt);
  }
  searchByFilterFreelancer(startdate: Date) {
    console.log('this is startdate :', Object.prototype.toString.call(startdate));
    if (Object.prototype.toString.call(startdate) === '[object Date]') {
      this.searchResults(startdate);
    } else {
      this.alertService.error('Please select job create date your looking.');

    }
  }
  searchResults(startdate: Date) {
    this.issearchbydate = false;
    this.timelaps = false;
    this.userFUObjList = [];
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
}


// just an interface for type safety.
interface marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}