import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { UserService } from '../AppRestCall/user/user.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { UserAdapter } from '../adapters/useradapter';
import { AlertsService } from '../AppRestCall/alerts/alerts.service';

@Component({
  selector: 'app-manageuser',
  templateUrl: './manageuser.component.html',
  styleUrls: ['./manageuser.component.css']
})
export class ManageuserComponent implements OnInit {

  usrObjCBAs: any = [];
  usrObjFUs: any = [];
  usrObjPlatformAdmins: any = [];
  usrObj: any = [];
  constructor(
    private userService: UserService,
    private spinnerService: Ng4LoadingSpinnerService,
    private userAdapter: UserAdapter,
    private alertService: AlertsService,
  ) { }

  ngOnInit() {
    this.getAllUser();
    $(document).ready(function() {
      /*$('#example').DataTable({
        aLengthMenu: [[5, 10, 25, -1], [5, 10, 25, 'All']],
        iDisplayLength: 5
      });*/
    });
  }
 getAllUser() {
  this.spinnerService.show();
  this.userService.getAllUsers().subscribe(
    (usrObjRsp: any) => {
      this.usrObj = usrObjRsp;
      usrObjRsp.forEach(element => {
        if (element.userroles.rolecode === 'CLIENT_BUSINESS_ADMINISTRATOR') {
          this.usrObjCBAs.push(element);
        }
        if (element.userroles.rolecode === 'FREELANCER_USER') {
          this.usrObjFUs.push(element);
        }
        if (element.userroles.rolecode === 'CORE_SERVICE_SUPPORT_TEAM' ||
            element.userroles.rolecode === 'CORE_SERVICE_SUPPORT_MANAGER') {
          this.usrObjPlatformAdmins.push(element);
        }
      });
      this.spinnerService.hide();
    },
    error => {
      this.spinnerService.hide();
      this.alertService.error(error);
    }
  );
 }
}
