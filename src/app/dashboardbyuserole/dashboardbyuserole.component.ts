import { Component, OnInit } from '@angular/core';
import { UserService } from '../AppRestCall/user/user.service';
import { config } from '../appconstants/config';
import { User } from '../appmodels/User';

@Component({
  selector: 'app-dashboardbyuserole',
  templateUrl: './dashboardbyuserole.component.html',
  styleUrls: ['./dashboardbyuserole.component.css']
})
export class DashboardbyuseroleComponent implements OnInit {

  stage1Img: string = '//placehold.it/200/dddddd/fff?text=1';
  stage2Img: string = '//placehold.it/200/dddddd/fff?text=2';
  stage3Img: string = '//placehold.it/200/dddddd/fff?text=3';
  stage4Img: string = '//placehold.it/200/dddddd/fff?text=4';
  stageCompletedImg: string = '//placehold.it/200/dddddd/fff?text=Completed';
  stageBgStatusApprovedImg: string = '//placehold.it/200/dddddd/fff?text=Approved';
  stageBgStatusRejectedImg: string = '//placehold.it/200/dddddd/fff?text=Rejected';
  usrObj: any;

  constructor(
    public userService: UserService,
  ) { }

  ngOnInit() {
    this.usrObj = this.userService.currentUserValue;
    if (this.usrObj.userroles.rolecode === config.user_rolecode_fu) {
      if (this.usrObj.freeLanceDetails.isprofilecompleted) {
        this.stage1Img = this.stageCompletedImg;
      }
      if (this.usrObj.freeLanceDetails.isbgstarted) {
      this.stage2Img = this.stageCompletedImg;
      }
      if (this.usrObj.freeLanceDetails.isbgdone) {
        this.stage3Img = this.stageCompletedImg;
        }
      this.usrObj.freelancehistoryentity.forEach(element => {
        if (element.bgstatus === config.bg_code_approved) {
          this.stage4Img = this.stageBgStatusApprovedImg;
          } else
        if (element.bgstatus === config.bg_code_rejected) {
                  this.stage4Img = this.stageBgStatusRejectedImg;
          }
      });
  }
}
}
