import { config } from 'src/app/appconstants/config';
import { Util } from 'src/app/appmodels/Util';
import { User } from 'src/app/appmodels/User';
import { ReferenceAdapter } from '../adapters/referenceadapter';
import { map, first } from 'rxjs/operators';
import { Component, OnInit, Inject } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { AlertsService } from '../AppRestCall/alerts/alerts.service';
import { UserService } from '../AppRestCall/user/user.service';
import { UserAdapter } from '../adapters/useradapter';
import { ReferenceService } from '../AppRestCall/reference/reference.service';
import { ConfigMsg } from '../appconstants/configmsg';
import { SendemailService } from '../AppRestCall/sendemail/sendemail.service';
import { ReferenceLookUpTemplateAdapter } from '../adapters/referencelookuptemplateadapter';
import { ReferenceLookUpTemplate } from '../appmodels/ReferenceLookUpTemplate';
import { environment } from 'src/environments/environment';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { UserNotification } from 'src/app/appmodels/UserNotification';
import { ConditionalExpr } from '@angular/compiler';
import { UserServiceDetails } from '../appmodels/UserServiceDetails';
import { UsersrvdetailsService } from '../AppRestCall/userservice/usersrvdetails.service';
import { UserServiceEventHistoryEntity } from '../appmodels/UserServiceEventHistoryEntity';
import { async } from '@angular/core/testing';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent implements OnInit {

  key: string;
  signupForm: FormGroup;
  issubmit = false;
  issubcatdisplay = false;
  referencedetailsmap = [];
  referencedetailsmapsubcat = [];
  referencedetailsmapsubcatselectedmapId: any = [];
  usrObj: User;
  templateObj: ReferenceLookUpTemplate;
  util: Util;
  isSelectedCategoryVal: string;
  usernotification: UserNotification;
  today = new Date();
  user: User;
  reflookupdetails: any;
  langcode: string;
  usersrvobj: UserServiceDetails;
  usersrvhistobj: UserServiceEventHistoryEntity;
  ourserviceid: number;


  constructor(
    private spinnerService: Ng4LoadingSpinnerService,
    public modalRef: BsModalRef,
    private formBuilder: FormBuilder,
    private refAdapter: ReferenceAdapter,
    private userAdapter: UserAdapter,
    private alertService: AlertsService,
    private userService: UserService,
    private referService: ReferenceService,
    private sendemailService: SendemailService,
    private reflookuptemplateAdapter: ReferenceLookUpTemplateAdapter,
    private usersrvDetails:UsersrvdetailsService,
  ) {
  }

  ngOnInit() {
    this.formValidations();
    if (this.key === config.shortkey_role_fu.toString()) {
      this.getAllCategories(this.langcode);
    }
    console.log("checking this values",this.ourserviceid,this.key);
  }

  formValidations() {
    if (this.key === config.shortkey_role_cba.toString()) {
      this.signupForm = this.formBuilder.group({
        password: ['', [Validators.required, Validators.minLength(8)]],
        username: ['', [Validators.required, Validators.email, Validators.maxLength(40)]],
        firstname: ['', [Validators.required, Validators.maxLength(40)]],
        lastname: ['', [Validators.required, Validators.maxLength(40)]],
        preferlang: ['', [Validators.required]],
      });
    } else {
      this.signupForm = this.formBuilder.group({
        password: ['', [Validators.required, Validators.minLength(8)]],
        username: ['', [Validators.required, Validators.email, Validators.maxLength(40)]],
        firstname: ['', [Validators.required, Validators.maxLength(40)]],
        lastname: ['', [Validators.required, Validators.maxLength(40)]],
        preferlang: ['', [Validators.required]],
        category: ['', [Validators.required]],
        subcategory: ['', [Validators.required]],
      });
    }
  }

  getAllCategories(langcode: string) {
    this.spinnerService.show();
    this.referService.getReferenceLookupByKey(config.key_domain.toString()).pipe(map((data: any[]) =>
      data.map(item => this.refAdapter.adapt(item))),
    ).subscribe(
      data => {
        this.reflookupdetails = data;
        for (const reflookup of data) {
          for (const reflookupmap of reflookup.referencelookupmapping) {
            if (langcode !== config.default_prefer_lang.toString()) {
              this.referService.translatetext(reflookupmap.label, langcode).subscribe(
                (resptranslatetxt: any) => {
                  if (resptranslatetxt.translateresp != null) {
                    reflookupmap.label = resptranslatetxt.translateresp;
                    this.referencedetailsmap.push(reflookupmap);
                  }
                },
                error => {
                  this.alertService.error(error);
                  this.spinnerService.hide();
                });
            } else {
              this.referencedetailsmap.push(reflookupmap);
            }
            for (const reflookupmapsubcat of reflookupmap.referencelookupmappingsubcategories) {
              if (langcode !== config.default_prefer_lang.toString()) {
                this.referService.translatetext(reflookupmapsubcat.label, langcode).subscribe(
                  (resptranslatetxt: any) => {
                    if (resptranslatetxt.translateresp != null) {
                      reflookupmapsubcat.label = resptranslatetxt.translateresp;
                      this.referencedetailsmapsubcat.push(reflookupmapsubcat);
                    }
                  },
                  error => {
                    this.alertService.error(error);
                    this.spinnerService.hide();
                  });
              } else {
                this.referencedetailsmapsubcat.push(reflookupmapsubcat);
              }
            }
          }
        }
        this.spinnerService.hide();
      },
      error => {
        this.alertService.error(error);
        this.spinnerService.hide();
      }
    );
  }

  subCategoryByMapId(value: string) {
    this.isSelectedCategoryVal = value;
    for (const listofcat of this.referencedetailsmapsubcat) {
      if (listofcat.mapId == value) {
        this.referencedetailsmapsubcatselectedmapId.push(listofcat);
        this.issubcatdisplay = false;
      } else {
        this.referencedetailsmapsubcatselectedmapId = [];
        this.issubcatdisplay = true;
      }
    }
  }

  get f() {
    return this.signupForm.controls;
  }

  saveUser() {
    this.issubmit = true;
    if (this.signupForm.invalid) {
      return;
    }
    this.spinnerService.show();
    this.userService.checkusernamenotexist(
      this.signupForm.get('username').value
    ).subscribe(
      (data: any) => {
        this.referService.getReferenceLookupByShortKey(this.key).subscribe(
          (refCode: any) => {
            this.userService.saveUser(
              this.signupForm.value, refCode.toString(), this.key, this.signupForm.value
            ).pipe(first()).subscribe(
              (resp) => {
                this.usrObj = this.userAdapter.adapt(resp);
                if (this.usrObj.userId > 0) {
                  //call userservice table
                /*  if(this.ourserviceid > 0) {
                    this.usersrvobj.ourserviceId = this.ourserviceid;
                    this.usersrvobj.userId = this.usrObj.userId;
                    this.usersrvobj.createdon = this.usrObj.fullname;
                    this.usersrvobj.userServiceEventHistory = new Array<UserServiceEventHistoryEntity>();
                    this.usersrvhistobj = new UserServiceEventHistoryEntity()
                    this.usersrvhistobj.userId = this.usrObj.userId;
                    this.usersrvobj.userServiceEventHistory.push(this.usersrvhistobj);
                    console.log(' this.usersrvobj' , this.usersrvobj);
                    this.usersrvDetails.saveUserServiceDetails(this.usersrvobj).subscribe(() =>
                        (error: string) => {
                          this.spinnerService.hide();
                          this.alertService.error(error);
                        }
                      );
                  }*/
                  this.referService.getLookupTemplateEntityByShortkey(config.shortkey_email_verificationemailaddress.toString()).subscribe(
                    referencetemplate => {
                      this.templateObj = this.reflookuptemplateAdapter.adapt(referencetemplate);
                      this.util = new Util();
                      this.util.preferlang = this.usrObj.preferlang;
                      this.util.fromuser = ConfigMsg.email_default_fromuser;
                      this.util.subject = ConfigMsg.email_verficationemailaddress_subj;
                      this.util.touser = this.usrObj.username;
                      this.util.templateurl = this.templateObj.url;
                      this.util.templatedynamicdata = JSON.stringify({
                        firstName: this.usrObj.firstname,
                        platformURL: `${environment.uiUrl}` + config.confirmation_fullpathname.toString()
                          + '/' + this.usrObj.userId
                      });
                      this.sendemailService.sendEmail(this.util).subscribe(
                        (util: any) => {
                          if (util.lastreturncode === 250) {
                            this.usernotification = new UserNotification();
                            this.usernotification.templateid = this.templateObj.templateid;
                            this.usernotification.sentby = this.usrObj.firstname;
                            this.usernotification.userid = this.usrObj.userId;
                            this.usernotification.senton = this.today.toString();
                            this.userService.saveUserNotification(this.usernotification).subscribe(
                              (notificationobj: any) => {
                                this.spinnerService.hide();
                                this.alertService.success(ConfigMsg.signup_successmsg, true);
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
              }
            );
          });
      },
      error => {
        this.spinnerService.hide();
        this.alertService.error(error);
      }
    );
  }
}
