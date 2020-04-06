import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { UserService } from '../AppRestCall/user/user.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { first } from 'rxjs/operators';
import { UserAdapter } from '../adapters/useradapter';
import { config } from 'src/app/appconstants/config';
import { AlertsService } from '../AppRestCall/alerts/alerts.service';
import { ReferenceService } from '../AppRestCall/reference/reference.service';
import { Util } from 'src/app/appmodels/Util';
import { User } from 'src/app/appmodels/User';
import { ReferenceLookUpTemplateAdapter } from '../adapters/referencelookuptemplateadapter';
import { ReferenceLookUpTemplate } from '../appmodels/ReferenceLookUpTemplate';
import { SendemailService } from '../AppRestCall/sendemail/sendemail.service';
import { ConfigMsg } from '../appconstants/configmsg';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-signupadmin',
  templateUrl: './signupadmin.component.html',
  styleUrls: ['./signupadmin.component.css']
})
export class SignupadminComponent implements OnInit {
  issubmit = false;
  signupAdminForm: FormGroup;
  usrObj: User;
  util: Util;
  templateObj: ReferenceLookUpTemplate;
  key: string;
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private spinnerService: Ng4LoadingSpinnerService,
    private userAdapter: UserAdapter,
    private alertService: AlertsService,
    private referService: ReferenceService,
    private reflookuptemplateAdapter: ReferenceLookUpTemplateAdapter,
    private sendemailService: SendemailService,

  ) { }

  ngOnInit() {
    this.formValiditionSignupAdmin();
  }

  formValiditionSignupAdmin() {
    this.signupAdminForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      firstname: ['', [Validators.required, Validators.maxLength(40)]],
      lastname: ['', [Validators.required, Validators.maxLength(40)]],
      rolecode: ['', [Validators.required]],
      password: [],
      preferlang: []
    });
  }

  get f() {
    return this.signupAdminForm.controls;
  }

  saveAdmin() {
    this.issubmit = true;
    if (this.signupAdminForm.invalid) {
      return;
    }
    this.spinnerService.show();
    if (this.signupAdminForm.get('rolecode').value === config.user_rolecode_cscm.toString()) {
      this.key = config.shortkey_role_cssm;
    }
    if (this.signupAdminForm.get('rolecode').value === config.user_rolecode_csct.toString()) {
      this.key = config.shortkey_role_csst;
    }
    this.userService.prepareAdminToSignUp(this.signupAdminForm.get('username').value)
      .pipe(first()).subscribe(
        (resp: any) => {
          this.signupAdminForm.patchValue({ password: resp.password });
          this.signupAdminForm.patchValue({ preferlang: config.default_prefer_lang.toString() });
          this.userService.saveUser(
            this.signupAdminForm.value, this.signupAdminForm.get('rolecode').value,
            this.key, this.signupAdminForm.value
          ).pipe(first()).subscribe(
            (respobj) => {
              this.usrObj = this.userAdapter.adapt(respobj);
              this.referService.getLookupTemplateEntityByShortkey(config.shortkey_email_welcometocsstorcssm.toString()).subscribe(
                referencetemplate => {
                  this.templateObj = this.reflookuptemplateAdapter.adapt(referencetemplate);
                  this.util = new Util();
                  this.util.preferlang = config.default_prefer_lang.toString();
                  this.util.fromuser = this.userService.currentUserValue.username;
                  this.util.subject = ConfigMsg.email_welcomeemailaddress_subj;
                  this.util.touser = this.usrObj.username;
                  this.util.templateurl = this.templateObj.url;
                  this.util.templatedynamicdata = JSON.stringify({
                    firstName: this.usrObj.firstname,
                    platformURL: `${environment.uiUrl}`,
                    userName: this.usrObj.username,
                    tempPassword: resp.password
                  });
                  this.sendemailService.sendEmail(this.util).subscribe(
                    (util: any) => {
                      if (util.lastreturncode === 250) {
                        this.spinnerService.hide();
                        this.alertService.success(ConfigMsg.signup_successmsg, true);
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
                }
              );
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
}
