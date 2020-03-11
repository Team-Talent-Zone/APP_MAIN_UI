import { Component, OnInit } from '@angular/core';
import { UserService } from '../AppRestCall/user/user.service';
import { Router } from '@angular/router';
import { User } from '../appmodels/User';
import { config } from '../appconstants/config';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  usrObj: User;
  showmenufu: boolean;
  constructor(
    private userService: UserService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.usrObj = this.userService.currentUserValue;
    if (this.usrObj.userroles.rolecode === config.user_rolecode_fu) {
    if (this.userService.currentUserValue.freelancehistoryentity.bgstatus ===
        config.bg_code_approved) {
      this.showmenufu = true;
      }
    if (this.userService.currentUserValue.freelancehistoryentity.bgstatus ===
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
