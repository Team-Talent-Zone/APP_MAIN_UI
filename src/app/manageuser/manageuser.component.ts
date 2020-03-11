import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { UserService } from '../AppRestCall/user/user.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { UserAdapter } from '../adapters/useradapter';
import { AlertsService } from '../AppRestCall/alerts/alerts.service';
import { User } from '../appmodels/User';
import { first } from 'rxjs/operators';
import { ReferenceService } from '../AppRestCall/reference/reference.service';
import { config } from 'src/app/appconstants/config';

@Component({
  selector: 'app-manageuser',
  templateUrl: './manageuser.component.html',
  styleUrls: ['./manageuser.component.css']
})
export class ManageuserComponent implements OnInit {

  usrObjCBAs: any = [];
  usrObjFUs: any = [];
  usrObjPlatformAdmins: any = [];
  usrObjMyWork: any = [];
  usrObj: any = [];
  usrobjById: User;
  refDataObj: any = [];
  constructor(
    private userService: UserService,
    private spinnerService: Ng4LoadingSpinnerService,
    private userAdapter: UserAdapter,
    private alertService: AlertsService,
    private referService: ReferenceService,
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
 getReferenceDataByKey() {
  this.referService.getReferenceLookupByKey(config.key_bgstatus).subscribe(
    (refdata: any) => {
      this.refDataObj = refdata;
    },
    error => {
      this.spinnerService.hide();
      this.alertService.error(error);
    });
 }
 getAllUser() {
  this.getReferenceDataByKey();
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
        if (element.userroles.rolecode === 'FREELANCER_USER' &&
            element.freelancehistoryentity.decisionby === this.userService.currentUserValue.username &&
            element.freelancehistoryentity.islocked === true
            ) {
          this.usrObjMyWork.push(element);
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
executeBGVerificationCheck(userId: number) {
  this.spinnerService.show();
  this.userService.getUserByUserId(userId).pipe(first()).subscribe(
    (respuser: any) => {
     this.usrobjById = respuser;
     this.usrobjById.freeLanceDetails.isbgstarted = true,
     this.referService.getReferenceLookupByShortKey(config.shortkey_bg_sentocsst).subscribe(
      (refCode: any) => {
        this.usrobjById.freelancehistoryentity.bgstatus = refCode.toString();
        this.usrobjById.freelancehistoryentity.decisionby = this.userService.currentUserValue.username;
        this.usrobjById.freelancehistoryentity.islocked = true;
        console.log('usrobjById', this.usrobjById);
        this.userService.saveorupdate(this.usrobjById).subscribe(
      (userObj: any) => {
        this.usrObj = this.userAdapter.adapt(userObj);
        if (this.userService.currentUserValue.userId === this.usrObj.userId) {
          this.userService.currentUserValue.avtarurl = this.usrObj.avtarurl;
          this.userService.currentUserValue.firstname = this.usrObj.firstname;
        }
        this.usrObjFUs = [];
        this.usrObjCBAs = [];
        this.usrObjPlatformAdmins = [];
        this.usrObjMyWork = [];
        this.alertService.success( this.usrObj.firstname + ' background verification started');
        this.spinnerService.hide();
        this.getAllUser();
      },
      error => {
        this.spinnerService.hide();
        this.alertService.error(error);
      });
    },
     error => {
      this.alertService.error(error);
      this.spinnerService.hide();
    });
      },
      error => {
        this.spinnerService.hide();
        this.alertService.error(error);
      });
}
}
