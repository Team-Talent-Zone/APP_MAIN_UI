import { config } from 'src/app/appconstants/config';
import { Util } from 'src/app/appmodels/Util';
import { User } from 'src/app/appmodels/User';
import { ReferenceAdapter } from '../adapters/referenceadapter';
import { map, first, catchError } from 'rxjs/operators';
import { Component, OnInit, Inject } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import {
  FormBuilder,
  FormGroup,
  Validators} from '@angular/forms';
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

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent implements OnInit {

  key: string;
  langSelected: string;
  signupForm: FormGroup;
  issubmit = false;
  issubcatdisplay = false;
  referencedetailsmap: any =  [];
  referencedetailsmapsubcat: any = [];
  referencedetailsmapsubcatselectedmapId: any = [];
  usrObj: User;
  templateObj: ReferenceLookUpTemplate;
  util: Util;
  isSelectedCategoryVal: string;
  usernotification: UserNotification;
  today =  new Date();

  constructor(
              private spinnerService: Ng4LoadingSpinnerService,
              public  modalRef: BsModalRef,
              private formBuilder: FormBuilder,
              private refAdapter: ReferenceAdapter,
              private userAdapter: UserAdapter,
              private alertService: AlertsService,
              private userService: UserService,
              private referService: ReferenceService,
              private sendemailService: SendemailService,
              private reflookuptemplateAdapter: ReferenceLookUpTemplateAdapter,
              ) {
   }

  ngOnInit() {
    console.log('Lang Selected Sigup' , this.langSelected);
    this.formValidations();
    if (this.key === config.shortkey_role_fu) {
      this.getAllCategories(this.langSelected);
   }
  }

 formValidations() {
    if (this.key === config.shortkey_role_cba) {
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


  getAllCategories(langSelected: string) {
   this.spinnerService.show();
   this.referService.getReferenceLookupByKey(config.key_domain).pipe(map((data: any[]) => data.map(item => this.refAdapter.adapt(item))),
    ).subscribe(
      data => {
        console.log(' langSelected : ' , langSelected);
        for (const reflookup of data ) {
          for (const reflookupmap of reflookup.referencelookupmapping) {
            if (langSelected === 'हिंदी' || langSelected === 'తెలుగు') {
              this.referService.translatetext(reflookupmap.label, langSelected).subscribe(
              (resptranslatetxt: any) => {
                if (resptranslatetxt.translateresp != null) {
                  reflookupmap.label = resptranslatetxt.translateresp;
                }
              },
              error => {
                this.alertService.error(error);
                this.spinnerService.hide();
              });
            }
            this.referencedetailsmap.push(reflookupmap);
            for (const reflookupmapsubcat of reflookupmap.referencelookupmappingsubcategories) {
              if (langSelected === 'हिंदी' || langSelected === 'తెలుగు') {
                this.referService.translatetext(reflookupmapsubcat.label, langSelected).subscribe(
                (resptranslatetxt: any) => {
                  if (resptranslatetxt.translateresp != null) {
                    reflookupmapsubcat.label = resptranslatetxt.translateresp;
                  }
                },
                error => {
                  this.alertService.error(error);
                  this.spinnerService.hide();
                });
              }
              this.referencedetailsmapsubcat.push(reflookupmapsubcat);
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
            refCode => {
              this.userService.saveUser(
                this.signupForm.value , refCode.toString() , this.key
                ).pipe(first()).subscribe(
                  (resp) => {
                    this.usrObj = this.userAdapter.adapt(resp);
                    if (this.usrObj.userId > 0) {
                      this.referService.getLookupTemplateEntityByShortkey(config.shortkey_email_verificationemailaddress).subscribe(
                        referencetemplate => {
                          this.templateObj = this.reflookuptemplateAdapter.adapt(referencetemplate);
                          this.util = new Util();
                          this.util.preferlang = this.usrObj.preferlang;
                          this.util.fromuser = ConfigMsg.email_default_fromuser;
                          this.util.subject = ConfigMsg.email_verficationemailaddress_subj;
                          this.util.touser = this.usrObj.username;
                          this.util.templateurl = this.templateObj.url;
                          this.util.templatedynamicdata = JSON.stringify({ firstName: this.usrObj.firstname ,
                                                  platformURL: `${environment.uiUrl}` + config.confirmation_fullpathname
                                                  + '/' + this.usrObj.userId});
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
                                     this.alertService.success(ConfigMsg.signup_successmsg , true);
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
