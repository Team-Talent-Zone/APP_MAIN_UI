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
import {
  FormBuilder,
  FormGroup,
  Validators} from '@angular/forms';
import { first } from 'rxjs/operators';
import { config } from 'src/app/appconstants/config';


@Component({
  selector: 'app-processnewservice',
  templateUrl: './processnewservice.component.html',
  styleUrls: ['./processnewservice.component.css']
})
export class ProcessnewserviceComponent implements OnInit {

  newserviceobj: NewService;
  issubmit = false;
  newserviceverificationForm: FormGroup;
  serviceHistory: NewServiceHistory;
  message: string;

  constructor(
    public  modalRef: BsModalRef,
    private formBuilder: FormBuilder,
    public userService: UserService,
    public newsvcservice: NewsvcService,
    private spinnerService: Ng4LoadingSpinnerService,
    private alertService: AlertsService,
    private manageserviceComponent: ManageserviceComponent,
    private router: Router,
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
    if (this.userService.currentUserValue.userroles.rolecode === config.user_rolecode_csct) {
      this.newserviceverificationForm.patchValue({status: config.newservice_code_senttocssm});
    }
    this.issubmit = true;
    if (this.newserviceverificationForm.invalid) {
        return;
      }
    this.spinnerService.show();
    this.newserviceobj.currentstatus = this.newserviceverificationForm.get('status').value;
    this.newserviceobj.serviceHistory[0].comment = this.newserviceverificationForm.get('comment').value;
    this.newserviceobj.serviceHistory[0].islocked = false;
    if (this.newserviceobj.currentstatus === 'APPROVED' ||
             this.newserviceobj.currentstatus === 'REJECTED') {
             console.log('inside if : ', this.newserviceverificationForm.get('status').value);
             if (this.newserviceobj.currentstatus === 'APPROVED') {
              this.newserviceobj.active = true;
              this.message = 'Approved';
             } else {
              this.newserviceobj.active = false;
              this.message = 'Rejected';
             }
             this.newserviceobj.isupgrade = false;
             this.newserviceobj.serviceHistory[0].status = this.newserviceobj.currentstatus ;
             this.newsvcservice.saveOrUpdateNewService(
              this.newserviceobj
              ).pipe(first()).subscribe(
               (newserviceObj: NewService) => {
                this.router.navigate(['/dashboard']);
                this.modalRef.hide();
                this.alertService.success('Changes done succcesfully with status ' +  this.message);
                this.spinnerService.hide();
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
          this.userService.getUserByUserId(this.newserviceobj.serviceHistory[0].userId).pipe(first()).subscribe(
            (respuser: any) => {
            this.serviceHistory.decisionBy = respuser.fullname;
            this.serviceHistory.decisionbyemailid = respuser.username;
            this.serviceHistory.islocked = true;
            this.newsvcservice.saveNewServiceHistory(
              this.serviceHistory
              ).pipe(first()).subscribe(
                (newservicehis: any) => {
                this.spinnerService.hide();
                this.router.navigate(['/dashboard']);
                this.modalRef.hide();
                this.alertService.success('Changes done succcesfully');
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
            }
            );
         },
         error => {
          this.spinnerService.hide();
          this.alertService.error(error);
          this.modalRef.hide();
        });
      }
  }
}
