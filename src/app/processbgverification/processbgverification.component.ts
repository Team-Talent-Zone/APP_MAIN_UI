import { FreelanceDocuments } from './../appmodels/FreelanceDocuments';
import { FreelanceHistory } from './../appmodels/FreelanceHistory';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { User } from '../appmodels/User';
import { UserService } from '../AppRestCall/user/user.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { first } from 'rxjs/operators';
import { AlertsService } from '../AppRestCall/alerts/alerts.service';
import { Router } from '@angular/router';
import { UtilService } from '../AppRestCall/util/util.service';
import { ConfigMsg } from '../appconstants/configmsg';
import { SendemailService } from '../AppRestCall/sendemail/sendemail.service';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { config } from 'src/app/appconstants/config';
import { Util } from 'src/app/appmodels/Util';
import { ReferenceLookUpTemplateAdapter } from '../adapters/referencelookuptemplateadapter';
import { ReferenceService } from '../AppRestCall/reference/reference.service';
import { ReferenceLookUpTemplate } from '../appmodels/ReferenceLookUpTemplate';

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
  additiondocreturnURL: any = null;
  util: Util;
  templateObj: ReferenceLookUpTemplate;
  refDataObj: any = [];
  statusTxt: string;
  bgshortkeyTxt: string;

  constructor(
    public modalRef: BsModalRef,
    public userService: UserService,
    private formBuilder: FormBuilder,
    private spinnerService: Ng4LoadingSpinnerService,
    private alertService: AlertsService,
    private router: Router,
    private cd: ChangeDetectorRef,
    private utilService: UtilService,
    private reflookuptemplateAdapter: ReferenceLookUpTemplateAdapter,
    private referService: ReferenceService,
    private sendemailService: SendemailService,
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
    if (this.userService.currentUserValue.userroles.rolecode === config.user_rolecode_csct.toString()) {
      this.bgverificationForm.patchValue({ bgstatus: config.bg_code_senttoccsm.toString() });
    }
    if (this.additiondocreturnURL === null) {
      this.bgverificationForm.patchValue({ docname: 'Document Name Here' });
    }
    this.issubmit = true;
    if (this.bgverificationForm.invalid) {
      return;
    }
    this.usrObjMyWork.freelancehistoryentity.islocked = false;
    if (this.userService.currentUserValue.userroles.rolecode === config.user_rolecode_csct.toString()) {
      this.userService.getUserByUserId(this.usrObjMyWork.freelancehistoryentity.managerid).pipe(first()).subscribe(
        (respuser: any) => {
          this.spinnerService.show();
          this.usrObjMyWork.freelancehistoryentity.bgcomment = this.bgverificationForm.get('bgcomment').value;
          let list = new Array<FreelanceHistory>();
          list.push(this.usrObjMyWork.freelancehistoryentity);
          this.usrObjMyWork.freelancehistoryentity = list;
          this.referService.getLookupTemplateEntityByShortkey(config.shortkey_email_senttocssm.toString()).subscribe(
            referencetemplate => {
              this.templateObj = this.reflookuptemplateAdapter.adapt(referencetemplate);
              this.util = new Util();
              this.util.preferlang = respuser.preferlang;
              this.util.fromuser = this.userService.currentUserValue.username;
              this.util.subject = ConfigMsg.email_bgverification_subj + this.usrObjMyWork.firstname +
                ' - ' + ConfigMsg.bg_status_txt_cssm_msg;
              this.util.touser = respuser.username;
              this.util.templateurl = this.templateObj.url;
              this.util.templatedynamicdata = JSON.stringify({
                bgstatus: ConfigMsg.bg_status_txt_cssm_msg,
                firstname: this.usrObjMyWork.firstname,
                name: respuser.firstname,
                decisionby: this.userService.currentUserValue.fullname,
              });
              this.sendemailService.sendEmail(this.util).subscribe(
                (util: any) => {
                  if (util.lastreturncode === 250) {
                    this.usrObjMyWork.freeLanceDetails.bgcurrentstatus = config.bg_code_senttoccsm.toString();
                    this.userService.saveorupdate(this.usrObjMyWork).subscribe(
                      (userObj: any) => {
                        this.freehistObj = new FreelanceHistory();
                        this.freehistObj.decisionby = respuser.fullname;
                        this.freehistObj.decisionbyemailid = respuser.username;
                        this.freehistObj.islocked = true;
                        this.freehistObj.bgstatus = config.bg_code_senttoccsm.toString();
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
                                  // tslint:disable-next-line: max-line-length
                                  this.alertService.success('Additional Doc Uploaded and Sent background verification to ' + freehisObj.decisionby);
                                },
                                error => {
                                  this.alertService.error(error);
                                  this.spinnerService.hide();
                                });
                            } else {
                              this.modalRef.hide();
                              this.spinnerService.hide();
                              this.alertService.success(' Sent BG verification to your manager ' + freehisObj.decisionby);
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
        }
      );
    }
    if (this.userService.currentUserValue.userroles.rolecode === config.user_rolecode_cscm.toString()) {
      if (this.bgverificationForm.get('bgstatus').value === config.bg_code_approved.toString() ||
        this.bgverificationForm.get('bgstatus').value === config.bg_code_rejected.toString()) {
        this.usrObjMyWork.freelancehistoryentity.bgcomment = this.bgverificationForm.get('bgcomment').value;
        this.usrObjMyWork.freeLanceDetails.bgcurrentstatus = this.bgverificationForm.get('bgstatus').value;
        this.usrObjMyWork.freelancehistoryentity.bgstatus = this.bgverificationForm.get('bgstatus').value;
        this.usrObjMyWork.freeLanceDetails.isbgdone = true;
        let csstid = this.usrObjMyWork.freelancehistoryentity.csstid;
        let list = new Array<FreelanceHistory>();
        list.push(this.usrObjMyWork.freelancehistoryentity);
        this.usrObjMyWork.freelancehistoryentity = list;
        this.spinnerService.show();
        this.userService.getUserByUserId(csstid).pipe(first()).subscribe(
          (respuser: any) => {
            if (this.bgverificationForm.get('bgstatus').value === config.bg_code_approved.toString()) {
              this.statusTxt = ConfigMsg.bg_status_txt_approve_msg;
              this.bgshortkeyTxt = config.shortkey_email_approved.toString();
            } else {
              this.statusTxt = ConfigMsg.bg_status_txt_rejected_msg;
              this.bgshortkeyTxt = config.shortkey_email_rejected.toString();
            }
            this.referService.getLookupTemplateEntityByShortkey(this.bgshortkeyTxt).subscribe(
              referencetemplate => {
                this.templateObj = this.reflookuptemplateAdapter.adapt(referencetemplate);
                this.util = new Util();
                this.util.preferlang = respuser.preferlang;
                this.util.fromuser = this.userService.currentUserValue.username;
                this.util.subject = ConfigMsg.email_bgverification_subj + this.usrObjMyWork.firstname + ' - ' + this.statusTxt;
                this.util.touser = respuser.username;
                this.util.templateurl = this.templateObj.url;
                this.util.templatedynamicdata = JSON.stringify({
                  bgstatus: this.statusTxt,
                  firstname: this.usrObjMyWork.firstname,
                  bgcomment: this.bgverificationForm.get('bgcomment').value,
                  name: respuser.firstname,
                  decisionby: this.userService.currentUserValue.fullname,
                });
                this.sendemailService.sendEmail(this.util).subscribe(
                  (util: any) => {
                    if (util.lastreturncode === 250) {
                      this.userService.saveorupdate(this.usrObjMyWork).subscribe(
                        (userObj: any) => {
                          this.router.navigate(['/dashboard']);
                          this.alertService.success(' Bg verification is completed ');
                          this.spinnerService.hide();
                          this.modalRef.hide();
                        },
                        error => {
                          this.alertService.error(error);
                          this.spinnerService.hide();
                        });
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
      } else {
        this.userService.getUserByUserId(this.usrObjMyWork.freelancehistoryentity.csstid).pipe(first()).subscribe(
          (respuser: any) => {
            this.spinnerService.show();
            this.usrObjMyWork.freelancehistoryentity.bgcomment = this.bgverificationForm.get('bgcomment').value;
            let list = new Array<FreelanceHistory>();
            list.push(this.usrObjMyWork.freelancehistoryentity);
            this.usrObjMyWork.freelancehistoryentity = list;
            this.referService.getLookupTemplateEntityByShortkey(config.shortkey_email_senttocsst.toString()).subscribe(
              referencetemplate => {
                this.templateObj = this.reflookuptemplateAdapter.adapt(referencetemplate);
                this.util = new Util();
                this.util.preferlang = respuser.preferlang;
                this.util.fromuser = this.userService.currentUserValue.username;
                this.util.subject = ConfigMsg.email_bgverification_subj + this.usrObjMyWork.firstname +
                  ' - ' + ConfigMsg.bg_status_txt_csst_msg;
                this.util.touser = respuser.username;
                this.util.templateurl = this.templateObj.url;
                this.util.templatedynamicdata = JSON.stringify({
                  bgstatus: ConfigMsg.bg_status_txt_csst_msg,
                  firstname: this.usrObjMyWork.firstname,
                  name: respuser.firstname,
                  decisionby: this.userService.currentUserValue.fullname,
                });
                this.sendemailService.sendEmail(this.util).subscribe(
                  (util: any) => {
                    if (util.lastreturncode === 250) {
                      this.usrObjMyWork.freeLanceDetails.bgcurrentstatus = config.bg_code_senttoccst.toString();
                      this.userService.saveorupdate(this.usrObjMyWork).subscribe(
                        (userObj: any) => {
                          this.freehistObj = new FreelanceHistory();
                          this.freehistObj.decisionby = respuser.fullname;
                          this.freehistObj.decisionbyemailid = respuser.username;
                          this.freehistObj.islocked = true;
                          this.freehistObj.bgstatus = config.bg_code_senttoccst.toString();
                          this.freehistObj.userid = userObj.userId;
                          this.freehistObj.managerid = this.userService.currentUserValue.userId;
                          this.freehistObj.csstid = respuser.userId;
                          this.userService.saveFreeLanceHistory(this.freehistObj).subscribe(
                            (freehisObj: any) => {
                              this.router.navigate(['/dashboard']);
                              this.alertService.success('Background verification sent back to ' + respuser.fullname);
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
    }
  }

  uploadFile(event) {
    let reader = new FileReader(); // HTML5 FileReader API
    let file = event.target.files[0];
    if (file.type === config.imgtype_pdf.toString() || file.type === config.imgtype_zip.toString()) {
      if (event.target.files && event.target.files[0]) {
        reader.readAsDataURL(file);

        // When file uploads set it to file formcontrol
        reader.onload = () => {
          this.spinnerService.show();
          this.utilService.uploadBgDocsInS3(reader.result, this.usrObjMyWork.userId, file.name).subscribe(
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
    } else {
      this.alertService.error('Invalid file format. it should be .pdf,.zip');
    }
  }
}
