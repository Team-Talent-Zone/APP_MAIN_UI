import { ReferenceLookUpTemplate } from './../appmodels/ReferenceLookUpTemplate';
import { ReferenceLookUpTemplateAdapter } from './../adapters/referencelookuptemplateadapter';
import { SendemailService } from './../AppRestCall/sendemail/sendemail.service';
import { UtilService } from './../AppRestCall/util/util.service';
import { ConfigMsg } from './../appconstants/configmsg';
import { NewServiceAdapter } from './../adapters/newserviceadapter';
import { UserService } from './../AppRestCall/user/user.service';
import { NewServiceHistory } from './../appmodels/NewServiceHistory';
import { NewsvcService } from './../AppRestCall/newsvc/newsvc.service';
import { NewService } from './../appmodels/NewService';
import { SignupComponent } from './../signup/signup.component';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { AlertsService } from '../AppRestCall/alerts/alerts.service';
import { ActivatedRoute, Router } from '@angular/router';
import { map, first } from 'rxjs/operators';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { ReferenceAdapter } from '../adapters/referenceadapter';
import { ReferenceService } from '../AppRestCall/reference/reference.service';
import { config } from 'src/app/appconstants/config';
import { Util } from '../appmodels/Util';

@Component({
  selector: 'app-newservice',
  templateUrl: './newservice.component.html',
  styleUrls: ['./newservice.component.css']
})
export class NewserviceComponent implements OnInit {

  serviceImgURL: any;
  newServiceForm: FormGroup;
  id: number;
  issubmit = false;
  referencedetailsmap: any = [];
  serviceterms: any;
  newservice: NewService;
  newservicecurrentObj: NewService;
  serviceHistory: NewServiceHistory;
  filename: string;
  name: string;
  util: Util;
  templateObj: ReferenceLookUpTemplate;

  constructor(
    private spinnerService: Ng4LoadingSpinnerService,
    private alertService: AlertsService,
    private cd: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private referService: ReferenceService,
    private refAdapter: ReferenceAdapter,
    public signupcomponent: SignupComponent,
    public newsvcservice: NewsvcService,
    public userService: UserService,
    private newserviceAdapter: NewServiceAdapter,
    private router: Router,
    private utilService: UtilService,
    private sendemailService: SendemailService,
    private reflookuptemplateAdapter: ReferenceLookUpTemplateAdapter,
  ) {
    route.params.subscribe(params => {
      this.id = params.id;
    });
    this.signupcomponent.referencedetailsmap = [];
  }

  ngOnInit() {
    this.signupcomponent.getAllCategories('en');
    this.getServiceTerms();
    this.newServiceValidationForm();
    if (this.id > 0) {
      this.populatenewservice(this.id);
    }
  }

  populatenewservice(ourserviceId: number) {
    this.spinnerService.show();
    this.newsvcservice.getNewServiceDetailsByServiceId(ourserviceId).pipe(first()).subscribe(
      (newserviceobj: NewService) => {
        newserviceobj.serviceHistory.forEach(element => {
          if (element.status === newserviceobj.currentstatus) {
            newserviceobj.serviceHistory = [];
            this.newservicecurrentObj = this.newserviceAdapter.adapt(newserviceobj);
            this.getCategoryByRefId(this.newservicecurrentObj.domain);
            this.newServiceForm.patchValue({ name: this.newservicecurrentObj.name });
            this.newServiceForm.patchValue({ description: this.newservicecurrentObj.description });
            this.newServiceForm.patchValue({ fullContent: this.newservicecurrentObj.fullContent });
            this.newServiceForm.patchValue({ validPeriod: this.newservicecurrentObj.validPeriod });
            this.newServiceForm.patchValue({ category: this.newservicecurrentObj.category });
            this.newServiceForm.patchValue({ domain: this.newservicecurrentObj.domain });
            this.newServiceForm.patchValue({ amount: this.newservicecurrentObj.amount });
            this.newServiceForm.patchValue({ imageUrl: this.newservicecurrentObj.imageUrl });
            this.serviceImgURL = this.newservicecurrentObj.imageUrl;
            this.newservicecurrentObj.serviceHistory.push(element);
          }
        });
      },
      error => {
        this.spinnerService.hide();
        this.alertService.error(error);
      });
  }

  newServiceValidationForm() {
    this.newServiceForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(40)]],
      description: ['', [Validators.required]],
      fullContent: ['', [Validators.required]],
      validPeriod: ['', [Validators.required]],
      category: ['', [Validators.required]],
      domain: ['', [Validators.required]],
      amount: ['', [Validators.maxLength(10), Validators.pattern('^[0-9]*$')]],
      imageUrl: ['', [Validators.required]],
    });
  }

  get f() {
    return this.newServiceForm.controls;
  }

  saveorupdateNewService(id: number) {
    this.newServiceForm.patchValue({ imageUrl: this.serviceImgURL });
    this.issubmit = true;
    if (this.newServiceForm.invalid) {
      return;
    }
    this.spinnerService.show();
    this.newservice = this.newserviceAdapter.adapt(this.newServiceForm.value);
    if (id > 0 && !this.newservicecurrentObj.active) {
      this.preparetoupdatenewservice(this.newservicecurrentObj, this.newservice);
    } else
      if (id > 0 && this.newservicecurrentObj.active) {
        this.preparetoupgradenewservice(this.newservicecurrentObj, this.newservice);
      } else {
        this.newservice.name = this.newServiceForm.get('name').value;
        this.newservice.category = this.newServiceForm.get('category').value;
        this.newservice.domain = this.newServiceForm.get('domain').value;
        this.newservice.fullContent = this.newServiceForm.get('fullContent').value;
        this.newservice.description = this.newServiceForm.get('description').value;
        this.newservice.userId = this.userService.currentUserValue.userId;
        this.newservice.validPeriod = this.newServiceForm.get('validPeriod').value;
        this.newservice.amount = this.newServiceForm.get('amount').value;
        this.newservice.createdBy = this.userService.currentUserValue.fullname;
        this.newservice.updatedBy = this.userService.currentUserValue.fullname;
        this.newservice.currentstatus = config.newservice_code_senttocssm;
        this.newservice.serviceHistory = new Array<NewServiceHistory>();
        this.serviceHistory = new NewServiceHistory();
        this.serviceHistory.userId = this.userService.currentUserValue.userId;
        this.serviceHistory.managerId = this.userService.currentUserValue.usermanagerdetailsentity.managerid;
        this.serviceHistory.status = config.newservice_code_senttocssm;
        this.newsvcservice.checkNewServiceIsExist(this.newServiceForm.get('name').value).pipe(first()).subscribe(
          (isnewserviceexisit: boolean) => {
            if (!isnewserviceexisit) {
              this.userService.getUserByUserId(this.serviceHistory.managerId).pipe(first()).subscribe(
                (respuser: any) => {
                  this.serviceHistory.decisionBy = respuser.fullname;
                  this.serviceHistory.decisionbyemailid = respuser.username;
                  this.newservice.serviceHistory.push(this.serviceHistory);
                  this.utilService.uploadAvatarsInS3(this.serviceImgURL, this.userService.currentUserValue.userId, this.filename).subscribe(
                    (returnURL: string) => {
                      this.newservice.imageUrl = returnURL;
                      this.newsvcservice.saveNewService(
                        this.newservice
                      ).pipe(first()).subscribe(
                        (newserviceObj: NewService) => {
                          this.referService.getLookupTemplateEntityByShortkey(config.shortkey_email_newservice_senttocssm).subscribe(
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
                                    this.newservice = this.newserviceAdapter.adapt(newserviceObj);
                                    this.spinnerService.hide();
                                    this.alertService.success(' Sent for review to your manager ' + this.serviceHistory.decisionBy);
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
                },
                error => {
                  this.spinnerService.hide();
                  this.alertService.error(error);
                });
            } else {
              this.spinnerService.hide();
              this.alertService.error(ConfigMsg.newservice_alreadyexist_msg);
            }
          },
          error => {
            this.spinnerService.hide();
            this.alertService.error(error);
          });
      }
  }

  preparetoupdatenewservice(newservicecurrentObj: NewService, newserviceForm: NewService) {
    newservicecurrentObj.amount = newserviceForm.amount;
    newservicecurrentObj.category = newserviceForm.category;
    newservicecurrentObj.domain = newserviceForm.domain;
    newservicecurrentObj.fullContent = newserviceForm.fullContent;
    newservicecurrentObj.description = newserviceForm.description;
    newservicecurrentObj.name = newserviceForm.name;
    newservicecurrentObj.validPeriod = newserviceForm.validPeriod;
    newservicecurrentObj.imageUrl = newserviceForm.imageUrl;
    newservicecurrentObj.createdBy = this.userService.currentUserValue.fullname;
    newservicecurrentObj.updatedBy = this.userService.currentUserValue.fullname;
    if (this.filename != null) {
      this.utilService.uploadAvatarsInS3(this.serviceImgURL, this.userService.currentUserValue.userId, this.filename).subscribe(
        (returnURL: string) => {
          newservicecurrentObj.imageUrl = returnURL;
          this.saveorupdatenewservice(newservicecurrentObj);
        },
        error => {
          this.spinnerService.hide();
          this.alertService.error(error);
        }
      );
    } else {
      this.saveorupdatenewservice(newservicecurrentObj);
    }
  }

  private saveorupdatenewservice(newservicecurrentObj: NewService) {
    this.newsvcservice.saveOrUpdateNewService(
      newservicecurrentObj
    ).pipe(first()).subscribe(
      (newserviceObj) => {
        this.spinnerService.hide();
        this.alertService.success(' Changes updated successfully ');
      },
      error => {
        this.spinnerService.hide();
        this.alertService.error(error);
      });
  }

  preparetoupgradenewservice(newservicecurrentObj: NewService, newserviceForm: NewService) {
    newservicecurrentObj.amount = newserviceForm.amount;
    newservicecurrentObj.category = newserviceForm.category;
    newservicecurrentObj.domain = newserviceForm.domain;
    newservicecurrentObj.fullContent = newserviceForm.fullContent;
    newservicecurrentObj.description = newserviceForm.description;
    newservicecurrentObj.name = newserviceForm.name;
    newservicecurrentObj.validPeriod = newserviceForm.validPeriod;
    newservicecurrentObj.amount = newserviceForm.amount;
    newservicecurrentObj.isupgrade = true;
    newservicecurrentObj.active = false;
    newservicecurrentObj.createdBy = this.userService.currentUserValue.fullname;
    newservicecurrentObj.updatedBy = this.userService.currentUserValue.fullname;
    newservicecurrentObj.currentstatus = config.newservice_code_senttocssm;
    newservicecurrentObj.serviceHistory[0].status = null;
    if (this.filename != null) {
      this.utilService.uploadAvatarsInS3(this.serviceImgURL, this.userService.currentUserValue.userId, this.filename).subscribe(
        (returnURL: string) => {
          newservicecurrentObj.imageUrl = returnURL;
          this.saveupgardenewservice(newservicecurrentObj);
        },
        error => {
          this.spinnerService.hide();
          this.alertService.error(error);
        }
      );
    } else {
      this.saveupgardenewservice(newservicecurrentObj);
    }
  }

  private saveupgardenewservice(newservicecurrentObj: NewService) {
    this.newsvcservice.saveOrUpdateNewService(
      newservicecurrentObj
    ).pipe(first()).subscribe(
      (newserviceObj: NewService) => {
        this.serviceHistory = new NewServiceHistory();
        this.serviceHistory.ourserviceId = newserviceObj.ourserviceId;
        this.serviceHistory.userId = this.userService.currentUserValue.userId;
        this.serviceHistory.managerId = this.userService.currentUserValue.usermanagerdetailsentity.managerid;
        this.serviceHistory.status = config.newservice_code_senttocssm;
        this.userService.getUserByUserId(this.serviceHistory.managerId).pipe(first()).subscribe(
          (respuser: any) => {
            this.serviceHistory.decisionBy = respuser.fullname;
            this.serviceHistory.decisionbyemailid = respuser.username;
            this.newsvcservice.saveNewServiceHistory(
              this.serviceHistory
            ).pipe(first()).subscribe(
              (newservicehis: any) => {
                this.router.navigate(['/dashboard']);
                this.spinnerService.hide();
                this.alertService.success(' Sent for review to your manager ' + this.serviceHistory.decisionBy);
              },
            );
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

  getCategoryByRefId(value: string) {
    this.referencedetailsmap = [];
    this.signupcomponent.referencedetailsmap.forEach(element => {
      if (element.refId == value) {
        this.referencedetailsmap.push(element);
      }
    });
  }
  getServiceTerms() {
    this.spinnerService.show();
    this.referService.getReferenceLookupByKey(config.key_service_term).
      pipe(map((data: any[]) => data.map(item => this.refAdapter.adapt(item))),
      ).subscribe(
        data => {
          this.serviceterms = data;
        });
  }

  uploadFile(event) {
    let reader = new FileReader(); // HTML5 FileReader API
    let file = event.target.files[0];
    if (file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/jpg') {
      if (event.target.files && event.target.files[0]) {
        reader.readAsDataURL(file);
        // When file uploads set it to file formcontrol
        reader.onload = () => {
          this.filename = file.name;
          this.serviceImgURL = reader.result;
          this.spinnerService.show();
          this.spinnerService.hide();
        };
        // ChangeDetectorRef since file is loading outside the zone
        this.cd.markForCheck();
      }
    } else {
      this.alertService.error('Invalid file format. it should be .png,.jpg,.jpeg');
    }
  }

}
