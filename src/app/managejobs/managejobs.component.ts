import { AlertsService } from './../AppRestCall/alerts/alerts.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../AppRestCall/user/user.service';
import { FreelanceserviceService } from '../AppRestCall/freelanceservice/freelanceservice.service';
import { FreelanceOnSvc } from '../appmodels/FreelanceOnSvc';
import { PaymentComponent } from '../payment/payment.component';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { timer } from 'rxjs';
import { FreelanceStarReview } from '../appmodels/FreelanceStarReview';
import { timestamp } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Toaster, ToastType } from 'ngx-toast-notifications';
import { ConfigMsg } from '../appconstants/configmsg';

@Component({
  selector: 'app-managejobs',
  templateUrl: './managejobs.component.html',
  styleUrls: ['./managejobs.component.css']
})

export class ManagejobsComponent implements OnInit {

  newlyPostedJobs: any = [];
  completedJobs: any = [];
  upComingPostedJobs: any = [];
  record: any = [];
  freelancestarobj: any;
  feedbackform: FormGroup;
  issubmit = false;
  isratingdisplay = false;
  private types: Array<ToastType> = ['success', 'danger', 'warning', 'info', 'primary', 'secondary', 'dark', 'light'];

  constructor(
    private toaster: Toaster,
    public fb: FormBuilder,
    private route: ActivatedRoute,
    private alertService: AlertsService,
    public userService: UserService,
    private router: Router,
    private freelanceserviceService: FreelanceserviceService,
    private spinnerService: Ng4LoadingSpinnerService,
    private modalRef: BsModalRef,
    private modalService: BsModalService,
  ) {
  }

  ngOnInit() {
    this.spinnerService.show();
    if (this.router.url.toString() === '/job'.toString()) {
      const sourcerefresh = timer(1000, 50000);
      sourcerefresh.subscribe((val: number) => {
        this.getUserAllJobDetailsByUserId();
      });
    }
  }

  autoToastNotificationsForCBA(fullmsg: string, typetxt: string, toasttitle: string) {
    this.showToastNotificationForFCBA(fullmsg, typetxt, toasttitle);
  }

  showToastNotificationForFCBA(txtmsg: string, typeName: any, toastheader: string) {
    const type = typeName;
    this.toaster.open({
      text: txtmsg,
      caption: toastheader + ' Notification',
      type: type,
    });
  }
  jobDone(jobId: number) {
    this.spinnerService.show();
    this.freelanceserviceService.getAllFreelanceOnServiceDetailsByJobId(jobId).subscribe((objfreelanceservice: FreelanceOnSvc) => {
      objfreelanceservice.isjobcompleted = true;
      // tslint:disable-next-line: max-line-length
      this.freelanceserviceService.saveOrUpdateFreelancerOnService(objfreelanceservice).subscribe((updatedobjfreelanceservice: FreelanceOnSvc) => {
        if (updatedobjfreelanceservice.jobId > 0) {
          // tslint:disable-next-line: max-line-length
          this.alertService.success('The JobId: ' + jobId + ' is completed successfully. Please click on the Pay. ');
          this.spinnerService.hide();
          this.getUserAllJobDetailsByUserId();
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

  activateJob(jobId: number) {
    if (this.newlyPostedJobs !== null) {
      this.newlyPostedJobs.forEach(element => {
        if (element.jobId == jobId) {
          this.spinnerService.show();
          this.freelanceserviceService.getAllFreelanceOnServiceDetailsByJobId(jobId).subscribe((objfreelanceservice: FreelanceOnSvc) => {
            objfreelanceservice.isjobactive = true;
            objfreelanceservice.tocompanyamount = element.tocompanyamount;
            objfreelanceservice.tofreelanceamount = element.tofreelanceamount;
            // tslint:disable-next-line: max-line-length
            this.freelanceserviceService.saveOrUpdateFreelancerOnService(objfreelanceservice).subscribe((updatedobjfreelanceservice: FreelanceOnSvc) => {
              if (updatedobjfreelanceservice.jobId > 0) {
                // tslint:disable-next-line: max-line-length
                this.alertService.success('The JobId: ' + jobId + ' is activiated and you will get a confirmation email once freelancer accept the job. ');
                this.spinnerService.hide();
                this.getUserAllJobDetailsByUserId();
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
      });
    }
  }

  cancelJob(jobId: number) {
    this.spinnerService.show();
    this.freelanceserviceService.getAllFreelanceOnServiceDetailsByJobId(jobId).subscribe((objfreelanceservice: FreelanceOnSvc) => {
      this.freelanceserviceService.deleteFreelanceSVCDetails(objfreelanceservice).subscribe((bol: boolean) => {
        if (bol) {
          this.alertService.success('The JobId: ' + jobId + ' is Cancelled');
          this.spinnerService.hide();
          this.getUserAllJobDetailsByUserId();
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

  getUserAllJobDetailsByUserId() {
    this.newlyPostedJobs = [];
    this.completedJobs = [];
    this.upComingPostedJobs = [];
    this.freelanceserviceService.getUserAllJobDetailsByUserId(this.userService.currentUserValue.userId).subscribe((onserviceList: any) => {
      onserviceList.forEach(element => {
        // tslint:disable-next-line: max-line-length
        if (!element.isjobcancel && !element.isjobcompleted && !element.isjobamtpaidtocompany && !element.isjobaccepted) {
          this.newlyPostedJobs.push(element);
          if (!element.isjobactive) {
            // tslint:disable-next-line: max-line-length
            const fullmsg = 'Hi ' + this.userService.currentUserValue.fullname + ', JobId:' + element.jobId + ' is not active yet. Please activiate it to make freelancer visible';
            this.autoToastNotificationsForCBA(fullmsg, this.types[2], 'Job');
          }
        }
        // tslint:disable-next-line: max-line-length
        if (element.isjobactive && element.isjobaccepted && !element.isjobamtpaidtocompany) {
          this.upComingPostedJobs.push(element);
          if (element.isjobcompleted) {
            // tslint:disable-next-line: max-line-length
            const ref = timer(10000, 50000);
            ref.subscribe((val: number) => {
              const fullmsg = 'Hi ' + this.userService.currentUserValue.fullname + ', For the JobId:' + element.jobId + ' pay now.';
              this.autoToastNotificationsForCBA(fullmsg, this.types[1], 'Job Payment Pending');
            });
          }
        }
        // tslint:disable-next-line: max-line-length
        if (element.isjobactive && element.isjobcompleted && element.isjobamtpaidtocompany && element.isjobaccepted) {
          this.completedJobs.push(element);
        }
      });
      this.spinnerService.hide();
    },
      error => {
        this.spinnerService.hide();
        this.alertService.error(error);
      });
  }

  openPaymentComponent(amount: number, jobId: string, subcategorylabel: string) {
    this.modalRef = this.modalService.show(PaymentComponent, {
      initialState: {
        totalAmountToPay: amount,
        jobids: jobId,
        productinfoParam: subcategorylabel + 'JobId#' + jobId
      }
    });
  }

  feedback(jobId: number) {
    this.record = [];
    this.feedbackformvalidation();
    this.isratingdisplay = true;
    for (let element of this.completedJobs) {
      if (element.jobId == jobId) {
        this.record = element;
      }
    }
  }

  feedbackformvalidation() {
    this.feedbackform = this.fb.group({
      starrate: ['', Validators.required],
      feedbackcomment: ['', Validators.required]
    });
  }

  savefeedback() {
    this.issubmit = true;
    if (this.feedbackform.invalid) {
      return;
    }
    this.freelancestarobj = new FreelanceStarReview();
    this.freelancestarobj.feedbackcomment = this.feedbackform.get('feedbackcomment').value;
    this.freelancestarobj.userId = this.userService.currentUserValue.userId;
    this.freelancestarobj.freelanceuserId = this.record.freelanceuserId;
    this.freelancestarobj.jobId = this.record.jobId;
    this.freelancestarobj.starrate = this.feedbackform.get('starrate').value;
    this.freelancestarobj.feedbackby = this.userService.currentUserValue.userbizdetails.bizname;
    this.spinnerService.show();
    this.freelanceserviceService.saveFreeLanceStarReviewFB(this.freelancestarobj).subscribe((response: FreelanceStarReview) => {
      if (response.id > 0) {
        this.alertService.success('Thank you for the feedback');
        this.spinnerService.hide();
      }
    },
      error => {
        this.spinnerService.hide();
        this.alertService.error(error);
      });
  }

  get f() {
    return this.feedbackform.controls;
  }
}
