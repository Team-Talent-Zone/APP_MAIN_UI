import { config } from 'src/app/appconstants/config';
import { Util } from 'src/app/appmodels/Util';
import { User } from 'src/app/appmodels/User';
import { ReferenceAdapter } from '../adapters/referenceadapter';
import { map, first } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
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
import { ConfigMsg } from '../AppConstants/configmsg';
import { SendemailService } from '../AppRestCall/sendemail/sendemail.service';
import { ReferenceLookUpTemplateAdapter } from '../adapters/referencelookuptemplateadapter';
import { ReferenceLookUpTemplate } from '../appmodels/ReferenceLookUpTemplate';

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
  referencedetailsmap: any =  [];
  referencedetailsmapsubcat: any = [];
  referencedetailsmapsubcatselectedmapId: any = [];
  usrObj: User;
  templateObj: ReferenceLookUpTemplate;
  util: Util;

  constructor(
              public  modalRef: BsModalRef,
              private http: HttpClient,
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
    this.formValidations();
    this.getAllCategories();
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

  getAllCategories() {
   this.referService.getReferenceLookupByKey(config.key_domain).pipe(map((data: any[]) => data.map(item => this.refAdapter.adapt(item))),
    ).subscribe(
      data => {
        for (const reflookup of data ) {
          for (const reflookupmap of reflookup.referencelookupmapping) {
            this.referencedetailsmap.push(reflookupmap);
            for (const reflookupmapsubcat of reflookupmap.referencelookupmappingsubcategories) {
              this.referencedetailsmapsubcat.push(reflookupmapsubcat);
            }
          }
        }
      },
      error => {
         this.alertService.error(error);
    }
    );
  }

  subCategoryByMapId(value: string) {
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
                          this.util.fromuser = config.email_default_fromuser;
                          this.util.subject = config.email_verficationemailaddress_subj;
                          this.util.touser = this.usrObj.username;
                          this.util.templateurl = this.templateObj.url;
                          this.util.arrayfromui = JSON.stringify({ firstName: this.usrObj.firstname ,
                                                  platformURL: 'http://localhost:4200/' });
                          this.sendemailService.sendEmail(this.util).subscribe(
                            util => {
                              this.alertService.success(ConfigMsg.signup_successmsg , true);
                            },
                            error => {
                              this.alertService.error(error);
                            });
                        },
                        error => {
                          this.alertService.error(error);
                        });
                    }
                  },
                  error => {
                    this.alertService.error(error);
                  }
                );
            });
         },
        error => {
          this.alertService.error(error);
        }
      );
  }
}
