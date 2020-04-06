import { Component, OnInit } from '@angular/core';
import { UserService } from '../AppRestCall/user/user.service';
import { Router } from '@angular/router';
import { User } from '../appmodels/User';
import { config } from '../appconstants/config';
import { ActivatedRoute } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { AlertsService } from '../AppRestCall/alerts/alerts.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  showmenufu: boolean;
  name: string;

  constructor(
    public userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private spinnerService: Ng4LoadingSpinnerService,
    private alertService: AlertsService,
  ) {
    route.params.subscribe(params => {
    this.name = params.name; });
    }

  ngOnInit() {
    if (this.name != null) {
      this.spinnerService.show();
      this.userService.getUserByUserId(this.userService.currentUserValue.userId).subscribe(
      (userresp: any) => {
        this.userService.setCurrentUserValue(userresp);
        this.spinnerService.hide();
      },
      error => {
        this.alertService.error(error);
        this.spinnerService.hide();
      });
    }

    if (this.userService.currentUserValue.userroles.rolecode === config.user_rolecode_fu) {
      if (this.userService.currentUserValue.freelancehistoryentity[0].bgstatus ===
        config.bg_code_approved) {
      this.showmenufu = true;
      }
      if (this.userService.currentUserValue.freelancehistoryentity[0].bgstatus ===
        config.bg_code_rejected) {
        this.showmenufu = false;
      }
  }
}

  logout() {
    this.userService.logout();
    this.router.navigate(['/app']);
  }
}
