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

  constructor(
    public userService: UserService,
  ) {
  }

  ngOnInit() {
    if (this.userService.currentUserValue.userroles.rolecode === config.user_rolecode_fu) {
      this.getAllActiveJobsDetailsBySubCategory();
    }
  }
  getAllActiveJobsDetailsBySubCategory() {

  }

}
