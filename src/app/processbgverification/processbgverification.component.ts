import { FreelanceDocuments } from './../appmodels/FreelanceDocuments';
import { FreelanceHistory } from './../appmodels/FreelanceHistory';
import { Component, OnInit , ChangeDetectorRef} from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { User } from '../appmodels/User';
import { UserService } from '../AppRestCall/user/user.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { first } from 'rxjs/operators';
import { AlertsService } from '../AppRestCall/alerts/alerts.service';
import { Router } from '@angular/router';
import { UtilService } from '../AppRestCall/util/util.service';
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
  freedocObj: FreelanceDocuments;
  existingfreelancehistoryObj: any;
  additiondocreturnURL: string = null;
  constructor(
    public  modalRef: BsModalRef,
    public userService: UserService,
    private formBuilder: FormBuilder,
    private spinnerService: Ng4LoadingSpinnerService,
    private alertService: AlertsService,
    private router: Router,
    private cd: ChangeDetectorRef,
    private utilService: UtilService,
  ) { }

  ngOnInit() {
    this.bgformValidations();
  }
bgformValidations() {
  this.bgverificationForm = this.formBuilder.group({
    bgstatus: ['', [Validators.required]],
    bgcomment: ['', [Validators.required]],
    docname: ['', [Validators.required]]
  });
}
get f() {
  return this.bgverificationForm.controls;
}

preparebgverfiDetailstoSave() {
  if ( this.userService.currentUserValue.userroles.rolecode === config.user_rolecode_csct) {
    this.bgverificationForm.patchValue({bgstatus: config.bg_code_senttoccsm});
  }
  if (this.additiondocreturnURL === null) {
    this.bgverificationForm.patchValue({docname: 'Document Name Here'});
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
                if (this.additiondocreturnURL != null) {
                this.freedocObj = new FreelanceDocuments();
                this.freedocObj.docurl = this.additiondocreturnURL;
                this.freedocObj.docname = this.bgverificationForm.get('docname').value;
                this.freedocObj.userid = this.usrObjMyWork.userId;
                this.userService.saveFreeLanceDocument(this.freedocObj).subscribe(
                    (freedocObj: any) => {
                      this.modalRef.hide();
                      this.spinnerService.hide();
                      this.alertService.success('Addition Doc Upload and Sent BG verification to ' + freehisObj.decisionby);
                    },
                    error => {
                      this.alertService.error(error);
                      this.spinnerService.hide();
                    });
                  } else {
                    this.modalRef.hide();
                    this.spinnerService.hide();
                    this.alertService.success(' Sent BG verification to ' + freehisObj.decisionby);
                  }
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

uploadFile(event) {
  let reader = new FileReader(); // HTML5 FileReader API
  let file = event.target.files[0];

  if (event.target.files && event.target.files[0]) {
    reader.readAsDataURL(file);

    // When file uploads set it to file formcontrol
    reader.onload = () => {
      this.spinnerService.show();
      this.utilService.uploadBgDocsInS3(reader.result , this.usrObjMyWork.userId).subscribe(
        (returnURL: string) => {
        this.additiondocreturnURL = returnURL;
        this.spinnerService.hide();
        },
        error => {
          this.spinnerService.hide();
          this.alertService.error(error);
        }
      );
    };
    // ChangeDetectorRef since file is loading outside the zone
    this.cd.markForCheck();
  }
 }
}
