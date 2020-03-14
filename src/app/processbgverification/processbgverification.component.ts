import { ConfigMsg } from './../appconstants/configmsg';
import { FreelanceHistory } from './../appmodels/FreelanceHistory';
import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { User } from '../appmodels/User';
import { UserService } from '../AppRestCall/user/user.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { first } from 'rxjs/operators';
import { AlertsService } from '../AppRestCall/alerts/alerts.service';
import { Router } from '@angular/router';

import {
  FormBuilder,
  FormGroup,
  Validators} from '@angular/forms';
import { config } from 'src/app/appconstants/config';

@Component({
  selector: 'app-processbgverification',
  templateUrl: './processbgverification.component.html',
  styleUrls: ['./processbgverification.component.css']
})
export class ProcessbgverificationComponent implements OnInit {

  usrdetailsObj: User;
  usrObjMyWork: any;
  bgverificationForm: FormGroup;
  issubmit = false;
  freehistObj: FreelanceHistory;
  existingfreelancehistoryObj: any;
  constructor(
    public  modalRef: BsModalRef,
    public userService: UserService,
    private formBuilder: FormBuilder,
    private spinnerService: Ng4LoadingSpinnerService,
    private alertService: AlertsService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.bgformValidations();
  }
bgformValidations() {
  this.bgverificationForm = this.formBuilder.group({
    bgstatus: ['', [Validators.required]],
    bgcomment: ['', [Validators.required]],
  });
}
get f() {
  return this.bgverificationForm.controls;
}

preparebgverfiDetailstoSave() {
  if ( this.userService.currentUserValue.userroles.rolecode === config.user_rolecode_csct) {
    this.bgverificationForm.patchValue({bgstatus: config.bg_code_senttoccsm});
  }
  this.issubmit = true;
  if (this.bgverificationForm.invalid) {
      return;
    }
  this.usrObjMyWork.freelancehistoryentity.islocked = false;
  if ( this.userService.currentUserValue.userroles.rolecode === config.user_rolecode_csct) {
    this.userService.getUserByUserId(this.usrObjMyWork.freelancehistoryentity.managerid).pipe(first()).subscribe(
      (respuser: any) => {
        this.spinnerService.show();
        this.usrObjMyWork.freelancehistoryentity.bgcomment = this.bgverificationForm.get('bgcomment').value;
        let list = new Array<FreelanceHistory>();
        list.push( this.usrObjMyWork.freelancehistoryentity);
        this.usrObjMyWork.freelancehistoryentity = list;
        this.userService.saveorupdate(this.usrObjMyWork).subscribe(
          (userObj: any) => {
            this.freehistObj = new FreelanceHistory();
            this.freehistObj.decisionby = respuser.username;
            this.freehistObj.islocked = true;
            this.freehistObj.bgstatus = config.bg_code_senttoccsm;
            this.freehistObj.managerid = respuser.userId;
            this.freehistObj.userid = userObj.userId;
            this.freehistObj.csstid = this.userService.currentUserValue.userId;
            this.userService.saveFreeLanceHistory(this.freehistObj).subscribe(
              (freehisObj: any) => {
                this.alertService.success(' Sent BG verification to ' + freehisObj.decisionby);
                this.spinnerService.hide();
                this.modalRef.hide();
              },
              error => {
                this.alertService.error(error);
                this.spinnerService.hide();
              });
          },
          error => {
            this.alertService.error(error);
            this.spinnerService.hide();
          });
      },
      error => {
        this.alertService.error(error);
        this.spinnerService.hide();
      });
  }
  if ( this.userService.currentUserValue.userroles.rolecode === config.user_rolecode_cscm) {
    if (this.bgverificationForm.get('bgstatus').value === config.bg_code_approved ||
        this.bgverificationForm.get('bgstatus').value === config.bg_code_rejected) {
          this.usrObjMyWork.freelancehistoryentity.bgcomment = this.bgverificationForm.get('bgcomment').value;
          this.usrObjMyWork.freelancehistoryentity.bgstatus = this.bgverificationForm.get('bgstatus').value;
          this.usrObjMyWork.freeLanceDetails.isbgdone = true;
          let list = new Array<FreelanceHistory>();
          list.push( this.usrObjMyWork.freelancehistoryentity);
          this.usrObjMyWork.freelancehistoryentity = list;
          this.userService.saveorupdate(this.usrObjMyWork).subscribe(
          (userObj: any) => {
            this.alertService.success(' Bg verification done ');
            this.spinnerService.hide();
            this.modalRef.hide();
          },
          error => {
            this.alertService.error(error);
            this.spinnerService.hide();
          });
    } else {
      this.userService.getUserByUserId(this.usrObjMyWork.freelancehistoryentity.csstid).pipe(first()).subscribe(
        (respuser: any) => {
        this.spinnerService.show();
        this.usrObjMyWork.freelancehistoryentity.bgcomment = this.bgverificationForm.get('bgcomment').value;
        let list = new Array<FreelanceHistory>();
        list.push( this.usrObjMyWork.freelancehistoryentity);
        this.usrObjMyWork.freelancehistoryentity = list;
        this.userService.saveorupdate(this.usrObjMyWork).subscribe(
        (userObj: any) => {
          this.freehistObj = new FreelanceHistory();
          this.freehistObj.decisionby = respuser.username;
          this.freehistObj.islocked = true;
          this.freehistObj.bgstatus = config.bg_code_senttoccst;
          this.freehistObj.userid = userObj.userId;
          this.freehistObj.managerid = this.userService.currentUserValue.userId;
          this.freehistObj.csstid = respuser.userId;
          this.userService.saveFreeLanceHistory(this.freehistObj).subscribe(
            (freehisObj: any) => {
              this.alertService.success(' Sent BG verification back to ' + respuser.username);
              this.spinnerService.hide();
              this.modalRef.hide();
            },
            error => {
              this.alertService.error(error);
              this.spinnerService.hide();
            });
        },
        error => {
          this.alertService.error(error);
          this.spinnerService.hide();
        });
       },
        error => {
          this.alertService.error(error);
          this.spinnerService.hide();
        });
    }
}
}


}
