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
  isNotFound = false;

  // google maps zoom level
  zoom: number = 12;

  markers: marker[] = [];

  mapClicked($event: MouseEvent) {
    this.markers.push({
      lat: $event.coords.lat,
      lng: $event.coords.lng,
      draggable: true
    });
  }

  ngOnInit() {
    this.searchByFilterFreelancer();
  }

  searchByFilterFreelancer() {
    this.userFUObjList = [];
    if (this.searchbyfiltername === config.search_byfilter_fu.toString() &&
      this.userService.currentUserValue.userroles.rolecode === config.user_rolecode_cba.toString() ||
      this.userService.currentUserValue.userroles.rolecode === config.user_rolecode_csct.toString() ||
      this.userService.currentUserValue.userroles.rolecode === config.user_rolecode_cscm.toString()) {
      this.userService.getUserDetailsByJobAvailable().subscribe(
        (userObjList: any) => {
          userObjList.forEach(element => {
            if (element.freeLanceDetails.subCategory === this.code &&
              element.userbizdetails.city === this.userService.currentUserValue.userbizdetails.city) {
              this.userFUObjList.push(this.userAdapter.adapt(element));
              var markPoints = {
                lat: element.userbizdetails.lat,
                lng: element.userbizdetails.lng,
                label: element.fullname,
                draggable: false,
                shortaddress: element.userbizdetails.shortaddress,
                abt: element.freeLanceDetails.abt,
                avtarurl: element.avtarurl
              };
              this.markers.push(markPoints);
            }
          });
          if (this.userFUObjList.length === 0) {
            this.isNotFound = true;
          }
        },
        error => {
          this.spinnerService.hide();
          this.alertService.error(error);
        }
      );
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