import { Component, OnInit } from '@angular/core';
import { UserService } from '../AppRestCall/user/user.service';
import { ActivatedRoute } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { User } from 'src/app/appmodels/User';
import { UserAdapter } from '../adapters/useradapter';
import { first } from 'rxjs/operators';
import { AlertsService } from '../AppRestCall/alerts/alerts.service';
import { Router } from '@angular/router';
import { config } from '../appconstants/config';
import { SendemailService } from '../AppRestCall/sendemail/sendemail.service';
import { ReferenceLookUpTemplate } from '../appmodels/ReferenceLookUpTemplate';
import { Util } from 'src/app/appmodels/Util';
import { ReferenceLookUpTemplateAdapter } from '../adapters/referencelookuptemplateadapter';
import { ReferenceService } from '../AppRestCall/reference/reference.service';
import { ConfigMsg } from '../appconstants/configmsg';
import { environment } from 'src/environments/environment';
import { UserNotification } from 'src/app/appmodels/UserNotification';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  modalRef: BsModalRef;
  id: number;
  usrObj: User;
  name: string;
  templateObj: ReferenceLookUpTemplate;
  util: Util;
  shortkeybyrolecode: string;
  usernotification: UserNotification;
  today = new Date();

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private modalService: BsModalService,
    private spinnerService: Ng4LoadingSpinnerService,
    private userAdapter: UserAdapter,
    private alertService: AlertsService,
    private referService: ReferenceService,
    private router: Router,
    private sendemailService: SendemailService,
    private reflookuptemplateAdapter: ReferenceLookUpTemplateAdapter,
  ) {
    route.params.subscribe(params => {
      this.id = params.id;
      this.name = params.name;
    });
  }

  ngOnInit() {
    this.checkConfirmation();
  }

  checkConfirmation() {
    if (this.id > 0 && this.name === config.confirmation_shortpathname.toString()) {
      this.spinnerService.show();
      this.userService.getUserByUserId(this.id).pipe(first()).subscribe(
        (resp) => {
          this.usrObj = this.userAdapter.adapt(resp);
          if (this.usrObj.userId > 0 && this.usrObj.isactive === false) {
            this.usrObj.updateby = this.usrObj.firstname;
            this.usrObj.isactive = true;
            this.userService.saveorupdate(this.usrObj).pipe(first()).subscribe(
              (userObj) => {
                this.usrObj = this.userAdapter.adapt(userObj);
                if (this.usrObj.userId > 0) {
                  if (this.usrObj.userroles.rolecode === config.user_rolecode_cba.toString()) {
                    this.shortkeybyrolecode = config.shortkey_email_welcometocba.toString();
                  } else {
                    this.shortkeybyrolecode = config.shortkey_email_welcometofu.toString();
                  }
                  this.referService.getLookupTemplateEntityByShortkey(this.shortkeybyrolecode).subscribe(
                    referencetemplate => {
                      this.templateObj = this.reflookuptemplateAdapter.adapt(referencetemplate);
                      this.util = new Util();
                      this.util.fromuser = ConfigMsg.email_default_fromuser;
                      this.util.preferlang = this.usrObj.preferlang;
                      this.util.subject = ConfigMsg.email_welcomeemailaddress_subj;
                      this.util.touser = this.usrObj.username;
                      this.util.templateurl = this.templateObj.url;
                      this.util.templatedynamicdata = JSON.stringify({
                        firstName: this.usrObj.firstname,
                        platformURL: `${environment.uiUrl}`
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
                                this.router.navigate(['/']);
                                this.alertService.success(ConfigMsg.email_verficationemailaddress_successmsg);
                              },
                              error => {
                                this.spinnerService.hide();
                                this.alertService.error(error);
                              });
                          }
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
              },
              error => {
                this.alertService.error(error);
                this.spinnerService.hide();
              });
          } else {
            this.spinnerService.hide();
            this.alertService.success(ConfigMsg.email_verficationemailaddress_alreadydone);
          }
        },
        error => {
          this.alertService.error(error);
          this.spinnerService.hide();
        });
    }
  }

}

