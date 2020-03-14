import { Component, OnInit, Inject } from '@angular/core';
import { Util } from 'src/app/appmodels/Util';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { UserService } from '../AppRestCall/user/user.service';
import { AlertsService } from '../AppRestCall/alerts/alerts.service';
import { UserAdapter } from '../adapters/useradapter';
import { User } from '../appmodels/User';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ReferenceService } from '../AppRestCall/reference/reference.service';
import { ReferenceLookUpTemplate } from '../appmodels/ReferenceLookUpTemplate';
import { ReferenceLookUpTemplateAdapter } from '../adapters/referencelookuptemplateadapter';
import { config } from 'src/app/appconstants/config';
import { environment } from 'src/environments/environment';
import { SendemailService } from '../AppRestCall/sendemail/sendemail.service';
import { ConfigMsg } from '../appconstants/configmsg';
import { UserNotification } from 'src/app/appmodels/UserNotification';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  fpwdForm: FormGroup;
  issubmit = false;
  isfpwdsubmit = false;
  isfwd = false;
  usrObj: User;
  templateObj: ReferenceLookUpTemplate;
  util: Util;
  usernotification: UserNotification;
  today =  new Date();
  avatarURL: any = config.default_avatar;

  constructor(
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private alertService: AlertsService,
    private userAdapter: UserAdapter,
    private router: Router,
    private spinnerService: Ng4LoadingSpinnerService,
    private referService: ReferenceService,
    private reflookuptemplateAdapter: ReferenceLookUpTemplateAdapter,
    private sendemailService: SendemailService,
    ) {
      }

  ngOnInit() {
    this.formValidations();
  }

  formValidations() {
    this.loginForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      username: ['', [Validators.required, Validators.email, Validators.maxLength(40)]]
      });
    this.fpwdForm = this.formBuilder.group({
      fpwdusername: ['', [Validators.required, Validators.email, Validators.maxLength(40)]]
      });
  }

  get f() {
    return this.loginForm.controls;
  }

  loginUserByUsername() {
    this.issubmit = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.spinnerService.show();
    this.userService.checkusername(
      this.loginForm.get('username').value
      ).subscribe(
        (data: any) => {
           this.userService.loginUserByUsername(
            this.loginForm.get('username').value,
            this.loginForm.get('password').value)
            .pipe(first()).subscribe(
              (resp) => {
                this.spinnerService.hide();
                this.router.navigate(['/dashboard']);
              },
              error => {
                this.spinnerService.hide();
                this.alertService.error(error);
              }
            );
        },
        error => {
          this.spinnerService.hide();
          this.alertService.error(error);
        });
  }
  get fpwd() {
    return this.fpwdForm.controls;
  }
  disFwd(isfwd: boolean) {
    this.isfwd = isfwd;
  }
  forgotPassword() {
    this.isfpwdsubmit = true;
    if (this.fpwdForm.invalid) {
      return;
    }
    this.spinnerService.show();
    this.userService.forgetPassword(this.fpwdForm.get('fpwdusername').value)
          .pipe(first()).subscribe(
            (resp) => {
            this.usrObj = this.userAdapter.adapt(resp);
            if (this.usrObj.userId > 0) {
                  this.referService.getLookupTemplateEntityByShortkey(config.shortkey_email_forgotpassword).subscribe(
                    referencetemplate => {
                      this.templateObj = this.reflookuptemplateAdapter.adapt(referencetemplate);
                      this.util = new Util();
                      this.util.preferlang = this.usrObj.preferlang;
                      this.util.fromuser = ConfigMsg.email_default_fromuser;
                      this.util.subject = ConfigMsg.email_forgotpasswordemailaddress_subj;
                      this.util.touser = this.usrObj.username;
                      this.util.templateurl = this.templateObj.url;
                      this.util.templatedynamicdata = JSON.stringify({ firstName: this.usrObj.firstname ,
                                              platformURL: `${environment.uiUrl}`,
                                              userName: this.usrObj.username ,
                                              tempPassword: this.usrObj.password });
                      this.sendemailService.sendEmail(this.util).subscribe(
                        (util: any) => {
                          if (util.lastreturncode === 250) {
                            this.userService.saveorupdate(this.usrObj)
                            .pipe(first()).subscribe(
                            (usrObjRsp) => {
                              this.usrObj = this.userAdapter.adapt(usrObjRsp);
                              if (this.usrObj.userId > 0) {
                                this.usernotification = new UserNotification();
                                this.usernotification.templateid = this.templateObj.templateid;
                                this.usernotification.sentby = this.usrObj.firstname;
                                this.usernotification.userid = this.usrObj.userId;
                                this.usernotification.senton = this.today.toString();
                                this.userService.saveUserNotification(this.usernotification).subscribe(
                                  (notificationobj: any) => {
                                    this.spinnerService.hide();
                                    this.alertService.success(ConfigMsg.fwdpassword_successmsg , true);
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
                          }},
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
          });
  }
}
