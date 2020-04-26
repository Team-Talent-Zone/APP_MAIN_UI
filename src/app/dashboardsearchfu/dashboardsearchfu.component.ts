import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { UserService } from './../AppRestCall/user/user.service';
import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { config } from '../appconstants/config';
import { AlertsService } from '../AppRestCall/alerts/alerts.service';
import { UserAdapter } from '../adapters/useradapter';

@Component({
  selector: 'app-dashboardsearchfu',
  templateUrl: './dashboardsearchfu.component.html',
  styleUrls: ['./dashboardsearchfu.component.css']
})
export class DashboardsearchfuComponent implements OnInit {

  code: string;
  name: string;
  filtername: string;
  userFUObjList: any = [];

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
      this.filtername = params.filtername;
    });
  }

  ngOnInit() {
    console.log(' search item', this.name);
    console.log(' search filtername', this.userService.currentUserValue.userroles.rolecode);
    if (this.userService.currentUserValue.userroles.rolecode === config.user_rolecode_cba.toString() ||
      this.userService.currentUserValue.userroles.rolecode === config.user_rolecode_csct.toString() ||
      this.userService.currentUserValue.userroles.rolecode === config.user_rolecode_cscm.toString()) {
      this.userService.getUserDetailsByJobAvailable().subscribe(
        (userObjList: any) => {
          userObjList.forEach(element => {
            console.log('.freeLanceDetails.subCategory', element.freeLanceDetails.subCategory);
            if (element.freeLanceDetails.subCategory === this.code) {
              this.userFUObjList.push(this.userAdapter.adapt(element));
            }
          });
          console.log("this.userFUObjList", this.userFUObjList);
        },
        error => {
          this.spinnerService.hide();
          this.alertService.error(error);
        }
      );
    }
  }
}
