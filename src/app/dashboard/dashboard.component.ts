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
  stage1Img: string = '//placehold.it/200/dddddd/fff?text=1';
  stage2Img: string = '//placehold.it/200/dddddd/fff?text=2';
  stage3Img: string = '//placehold.it/200/dddddd/fff?text=3';
  stage4Img: string = '//placehold.it/200/dddddd/fff?text=4';
  stageCompletedImg: string = '//placehold.it/200/dddddd/fff?text=Completed';
  stageBgStatusApprovedImg: string = '//placehold.it/200/dddddd/fff?text=Approved';
  stageBgStatusRejectedImg: string = '//placehold.it/200/dddddd/fff?text=Rejected';
  showmenufu: boolean;
  constructor(
    private userService: UserService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.usrObj = this.userService.currentUserValue;
    if (this.usrObj.userroles.rolecode === config.user_rolecode_fu) {
      if (this.userService.currentUserValue.freeLanceDetails.isprofilecompleted) {
        this.stage1Img = this.stageCompletedImg;
      }
      if (this.userService.currentUserValue.freeLanceDetails.isbgstarted) {
      this.stage2Img = this.stageCompletedImg;
      }
      if (this.userService.currentUserValue.freeLanceDetails.isbgdone) {
        this.stage3Img = this.stageCompletedImg;
        }
      if (this.userService.currentUserValue.freelancehistoryentity.bgstatus === config.bg_code_approved) {
          this.stage4Img = this.stageBgStatusApprovedImg;
          this.showmenufu = true;
          }
      if (this.userService.currentUserValue.freelancehistoryentity.bgstatus === config.bg_code_rejected) {
            this.stage4Img = this.stageBgStatusRejectedImg;
            this.showmenufu = false;
          }
    }
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['/app']);
  }
}
