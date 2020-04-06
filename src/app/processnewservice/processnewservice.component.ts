import { Router } from '@angular/router';
import { ManageserviceComponent } from './../manageservice/manageservice.component';
import { NewServiceHistory } from './../appmodels/NewServiceHistory';
import { AlertsService } from './../AppRestCall/alerts/alerts.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { NewsvcService } from './../AppRestCall/newsvc/newsvc.service';
import { UserService } from './../AppRestCall/user/user.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Component, OnInit } from '@angular/core';
import { NewService } from '../appmodels/NewService';
import { ReferenceService } from '../AppRestCall/reference/reference.service';
import { UtilService } from './../AppRestCall/util/util.service';
import { ConfigMsg } from './../appconstants/configmsg';
import { SendemailService } from './../AppRestCall/sendemail/sendemail.service';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { first } from 'rxjs/operators';
import { config } from 'src/app/appconstants/config';
import { ReferenceLookUpTemplateAdapter } from './../adapters/referencelookuptemplateadapter';
import { Util } from '../appmodels/Util';
import { ReferenceLookUpTemplate } from './../appmodels/ReferenceLookUpTemplate';


@Component({
  selector: 'app-processnewservice',
  templateUrl: './processnewservice.component.html',
  styleUrls: ['./processnewservice.component.css']
})
export class ProcessnewserviceComponent implements OnInit {

  newserviceobj: NewService;
  newservicedetailswithallCommentHistory: any;
  issubmit = false;
  newserviceverificationForm: FormGroup;
  serviceHistory: NewServiceHistory;
  message: string;
  util: Util;
  templateObj: ReferenceLookUpTemplate;
  shortkey: string;
  constructor(
    public modalRef: BsModalRef,
    private formBuilder: FormBuilder,
    public userService: UserService,
    public newsvcservice: NewsvcService,
    private spinnerService: Ng4LoadingSpinnerService,
    private alertService: AlertsService,
    private manageserviceComponent: ManageserviceComponent,
    private router: Router,
    private referService: ReferenceService,
    private utilService: UtilService,
    private sendemailService: SendemailService,
    private reflookuptemplateAdapter: ReferenceLookUpTemplateAdapter,
  ) { }

  ngOnInit() {
    this.newServiceformValidations();
  }

  newServiceformValidations() {
    this.newserviceverificationForm = this.formBuilder.group({
      status: ['', [Validators.required]],
      comment: ['', [Validators.required]]
    });
  }
  get f() {
    return this.newserviceverificationForm.controls;
  }

  preparenewServiceverfiDetailstoSave() {
    if (this.userService.currentUserValue.userroles.rolecode === config.user_rolecode_csct.toString()) {
      this.newserviceverificationForm.patchValue({ status: config.newservice_code_senttocssm.toString() });
    }
    this.issubmit = true;
    if (this.newserviceverificationForm.invalid) {
      return;
    }
    this.spinnerService.show();
    this.newserviceobj.currentstatus = this.newserviceverificationForm.get('status').value;
    this.newserviceobj.serviceHistory[0].islocked = false;
    if (this.newserviceobj.currentstatus === config.newservice_code_approved.toString() ||
      this.newserviceobj.currentstatus === config.newservice_code_rejected.toString()) {
      if (this.newserviceobj.currentstatus === config.newservice_code_approved.toString()) {
        this.newserviceobj.active = true;
        this.message = 'Approved';
        this.shortkey = config.shortkey_email_newservice_senttocssmapproved.toString();
      } else {
        this.newserviceobj.active = false;
        this.message = 'Rejected';
        this.shortkey = config.shortkey_email_newservice_senttocssmreject.toString();
      }
      this.newserviceobj.isupgrade = false;
      this.newserviceobj.serviceHistory[0].status = null;
      this.newsvcservice.saveOrUpdateNewService(
        this.newserviceobj
      ).pipe(first()).subscribe(
        (newserviceObj: NewService) => {
          this.serviceHistory = new NewServiceHistory();
          this.serviceHistory.ourserviceId = newserviceObj.ourserviceId;
          this.serviceHistory.userId = this.userService.currentUserValue.userId;
          this.serviceHistory.managerId = this.userService.currentUserValue.usermanagerdetailsentity.managerid;
          this.serviceHistory.status = this.newserviceverificationForm.get('status').value;
          this.serviceHistory.comment = this.newserviceverificationForm.get('comment').value;
          this.serviceHistory.islocked = false;
          this.userService.getUserByUserId(this.newserviceobj.serviceHistory[0].userId).pipe(first()).subscribe(
            (respuser: any) => {
              this.serviceHistory.decisionBy = this.userService.currentUserValue.fullname;
              this.serviceHistory.decisionbyemailid = this.userService.currentUserValue.username;
              this.serviceHistory.previousdecisionby = respuser.fullname;
              this.newsvcservice.saveNewServiceHistory(
                this.serviceHistory
              ).pipe(first()).subscribe(
                (hist: any) => {
                  this.referService.getLookupTemplateEntityByShortkey(this.shortkey).subscribe(
                    referencetemplate => {
                      this.templateObj = this.reflookuptemplateAdapter.adapt(referencetemplate);
                      this.util = new Util();
                      this.util.preferlang = respuser.preferlang;
                      this.util.fromuser = this.userService.currentUserValue.username;
                      this.util.subject = ConfigMsg.email_newserviceverification_subj + newserviceObj.name +
                        ' is ' + this.message;
                      this.util.touser = respuser.username;
                      this.util.templateurl = this.templateObj.url;
                      this.util.templatedynamicdata = JSON.stringify({
                        servicepackname: newserviceObj.name,
                        firstname: respuser.firstname,
                        decisionby: this.userService.currentUserValue.fullname,
                      });
                      this.sendemailService.sendEmail(this.util).subscribe(
                        (util: any) => {
                          if (util.lastreturncode === 250) {
                            this.router.navigate(['/dashboard']);
                            this.modalRef.hide();
                            this.alertService.success('Changes done succcesfully with status ' + this.message);
                            this.spinnerService.hide();
                          }
                        },
                        error => {
                          this.spinnerService.hide();
                          this.alertService.error(error);
                          this.modalRef.hide();
                        });
                    },
                    error => {
                      this.spinnerService.hide();
                      this.alertService.error(error);
                      this.modalRef.hide();
                    });
                },
                error => {
                  this.spinnerService.hide();
                  this.alertService.error(error);
                  this.modalRef.hide();
                });
            },
            error => {
              this.spinnerService.hide();
              this.alertService.error(error);
              this.modalRef.hide();
            });
        },
        error => {
          this.spinnerService.hide();
          this.alertService.error(error);
          this.modalRef.hide();
        });
    } else {
      this.newserviceobj.serviceHistory[0].status = null;
      this.newsvcservice.saveOrUpdateNewService(
        this.newserviceobj
      ).pipe(first()).subscribe(
        (newserviceObj: NewService) => {
          this.serviceHistory = new NewServiceHistory();
          this.serviceHistory.ourserviceId = newserviceObj.ourserviceId;
          this.serviceHistory.userId = this.userService.currentUserValue.userId;
          this.serviceHistory.managerId = this.userService.currentUserValue.usermanagerdetailsentity.managerid;
          this.serviceHistory.status = this.newserviceverificationForm.get('status').value;
          this.serviceHistory.comment = this.newserviceverificationForm.get('comment').value;
          this.userService.getUserByUserId(this.newserviceobj.serviceHistory[0].userId).pipe(first()).subscribe(
            (respuser: any) => {
              this.serviceHistory.decisionBy = respuser.fullname;
              this.serviceHistory.decisionbyemailid = respuser.username;
              this.serviceHistory.islocked = true;
              this.serviceHistory.previousdecisionby = this.userService.currentUserValue.fullname;
              this.newsvcservice.saveNewServiceHistory(
                this.serviceHistory
              ).pipe(first()).subscribe(
                () => {
                  if (this.userService.currentUserValue.userroles.rolecode === config.user_rolecode_cscm.toString()) {
                    this.referService.getLookupTemplateEntityByShortkey(config.shortkey_email_newservice_senttocsst.toString()).subscribe(
                      referencetemplate => {
                        this.templateObj = this.reflookuptemplateAdapter.adapt(referencetemplate);
                        this.util = new Util();
                        this.util.preferlang = respuser.preferlang;
                        this.util.fromuser = this.userService.currentUserValue.username;
                        this.util.subject = ConfigMsg.email_newserviceverification_subj + newserviceObj.name +
                          ' - ' + ConfigMsg.newservice_txt_csst_msg;
                        this.util.touser = respuser.username;
                        this.util.templateurl = this.templateObj.url;
                        this.util.templatedynamicdata = JSON.stringify({
                          servicepackname: newserviceObj.name,
                          firstname: respuser.firstname,
                          decisionby: this.userService.currentUserValue.fullname,
                          comment: newserviceObj.serviceHistory[0].comment
                        });
                        this.sendemailService.sendEmail(this.util).subscribe(
                          (util: any) => {
                            if (util.lastreturncode === 250) {
                              this.spinnerService.hide();
                              this.router.navigate(['/dashboard']);
                              this.modalRef.hide();
                              this.alertService.success('Changes done succcesfully');
                            }
                          },
                        );
                      },
                      error => {
                        this.spinnerService.hide();
                        this.alertService.error(error);
                        this.modalRef.hide();
                      });
                  } else {
                    this.referService.getLookupTemplateEntityByShortkey(config.shortkey_email_newservice_senttocssm.toString()).subscribe(
                      referencetemplate => {
                        this.templateObj = this.reflookuptemplateAdapter.adapt(referencetemplate);
                        this.util = new Util();
                        this.util.preferlang = respuser.preferlang;
                        this.util.fromuser = this.userService.currentUserValue.username;
                        this.util.subject = ConfigMsg.email_newserviceverification_subj + newserviceObj.name +
                          ' - ' + ConfigMsg.newservice_txt_cssm_msg;
                        this.util.touser = respuser.username;
                        this.util.templateurl = this.templateObj.url;
                        this.util.templatedynamicdata = JSON.stringify({
                          servicepackname: newserviceObj.name,
                          firstname: respuser.firstname,
                          createdby: newserviceObj.createdBy,
                        });
                        this.sendemailService.sendEmail(this.util).subscribe(
                          (util: any) => {
                            if (util.lastreturncode === 250) {
                              this.router.navigate(['/dashboard']);
                              this.modalRef.hide();
                              this.alertService.success('Changes done succcesfully');
                              this.spinnerService.hide();
                            }
                          },
                          error => {
                            this.spinnerService.hide();
                            this.alertService.error(error);
                          });
                      },
                      error => {
                        this.spinnerService.hide();
                        this.alertService.error(error);
                      });
                  }
                },
                error => {
                  this.spinnerService.hide();
                  this.alertService.error(error);
                  this.modalRef.hide();
                }
              );
            },
            error => {
              this.spinnerService.hide();
              this.alertService.error(error);
              this.modalRef.hide();
            });
        },
        error => {
          this.spinnerService.hide();
          this.alertService.error(error);
          this.modalRef.hide();
        });
    }
  }
}
