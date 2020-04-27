import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { AlertsService } from './../AppRestCall/alerts/alerts.service';
import { UserServicedetailsAdapter } from './../adapters/userserviceadapter';
import { UserService } from '../AppRestCall/user/user.service';
import { Component, OnInit } from '@angular/core';
import { UsersrvdetailsService } from '../AppRestCall/userservice/usersrvdetails.service';
import { config } from '../appconstants/config';

@Component({
  selector: 'app-dashboardmapbyuserole',
  templateUrl: './dashboardmapbyuserole.component.html',
  styleUrls: ['./dashboardmapbyuserole.component.css']
})
export class DashboardmapbyuseroleComponent implements OnInit {

  userservicedetailsList = new Array();
  userservicedetailsExistingIds = new Array();

  constructor(
    public userService: UserService,
    private usersrvDetails: UsersrvdetailsService,
    private userServicedetailsAdapter: UserServicedetailsAdapter,
    private alertService: AlertsService,
    private spinnerService: Ng4LoadingSpinnerService,
  ) {
  }

  ngOnInit() {
    if (this.userService.currentUserValue.userroles.rolecode === config.user_rolecode_cba) {
      setTimeout(() => {
        this.getAllUserServiceDetailsByUserId(this.userService.currentUserValue.userId);
      }, 1000);
    }
  }

  getAllUserServiceDetailsByUserId(userId: number) {
    this.spinnerService.show();
    this.userservicedetailsList = [];
    this.userservicedetailsExistingIds = [];
    this.usersrvDetails.getAllUserServiceDetailsByUserId(userId).subscribe(
      (listofusersrvDetails: any) => {
        listofusersrvDetails.forEach(element => {
          this.userservicedetailsList.push(this.userServicedetailsAdapter.adapt(element));
          this.userservicedetailsExistingIds.push(element.ourserviceId);
        });
        this.spinnerService.hide();
      },
      error => {
        this.alertService.error(error);
        this.spinnerService.hide();
      }
    );
  }
}
