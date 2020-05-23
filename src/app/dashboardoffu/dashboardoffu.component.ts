import { UserService } from './../AppRestCall/user/user.service';
import { Component, OnInit } from '@angular/core';
import { config } from '../appconstants/config';
import { ReferenceService } from '../AppRestCall/reference/reference.service';
import { ReferenceAdapter } from '../adapters/referenceadapter';
import { PaymentComponent } from '../payment/payment.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AlertsService } from '../AppRestCall/alerts/alerts.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { FreelanceOnSvcService } from '../AppRestCall/freelanceOnSvc/freelance-on-svc.service';
import { FreelanceOnSvc } from '../appmodels/FreelanceOnSvc';
import { ToastConfig, Toaster, ToastType } from 'ngx-toast-notifications';
import { ConfigMsg } from '../appconstants/configmsg';
import { timer } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboardoffu',
  templateUrl: './dashboardoffu.component.html',
  styleUrls: ['./dashboardoffu.component.css']
})
export class DashboardoffuComponent implements OnInit {

  stage1Img: string = '//placehold.it/200/dddddd/fff?text=1';
  stage2Img: string = '//placehold.it/200/dddddd/fff?text=2';
  stage3Img: string = '//placehold.it/200/dddddd/fff?text=3';
  stage4Img: string = '//placehold.it/200/dddddd/fff?text=4';
  stage5Img: string = '//placehold.it/200/dddddd/fff?text=5';
  stageCompletedImg: string = '//placehold.it/200/dddddd/fff?text=Completed';
  stageBgStatusApprovedImg: string = '//placehold.it/200/dddddd/fff?text=Approved';
  stageBgStatusRejectedImg: string = '//placehold.it/200/dddddd/fff?text=Rejected';
  usrObj: any;
  indiaTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
  referenceobj: any;
  istimelap = false;
  listofalljobs: any;
  newJobList: any = [];
  upcomingJobList: any = [];
  completedJobList: any = [];
  freelancesvcobj: FreelanceOnSvc;
  freelancedetailsbyId: any;
  totalEarnings = 0;
  earnFlag = false;
  upcomingflag = false;
  totalupcomingEarnings = 0;
  infoCards = [];
  cancelminsdiff: number;
  private types: Array<ToastType> = ['success', 'danger', 'warning', 'info', 'primary', 'secondary', 'dark', 'light'];


  constructor(
    public userService: UserService,
    private referService: ReferenceService,
    private referenceadapter: ReferenceAdapter,
    private modalRef: BsModalRef,
    private modalService: BsModalService,
    private spinnerService: Ng4LoadingSpinnerService,
    private alertService: AlertsService,
    private freelanceSvc: FreelanceOnSvcService,
    private toaster: Toaster,
    private router: Router,
  ) { }

  ngOnInit() {
    const source = timer(1000, 20000);
    const sourcerefresh = timer(1000, 30000);
    source.subscribe((val: number) => {
      this.autoToastNotificationsForFU();
    });
    sourcerefresh.subscribe((val: number) => {
      if (this.router.url === '/dashboard') {
        if (this.userService.currentUserValue.freeLanceDetails.isregfeedone) {
          this.getUserAllJobDetailsByUserId();
        }
      }
    });
    if (!this.userService.currentUserValue.freeLanceDetails.isregfeedone) {
      setTimeout(() => {
        this.spinnerService.show();
        this.referService.getReferenceLookupByKey(config.refer_key_furegfee.toString()).pipe().subscribe((refObj: any) => {
          this.referenceobj = refObj;
          this.spinnerService.hide();
          this.istimelap = true;
        },
          error => {
            this.spinnerService.hide();
            this.alertService.error(error);
          });
      }, 500);
    }

    this.usrObj = this.userService.currentUserValue;
    if (this.usrObj.userroles.rolecode === config.user_rolecode_fu.toString()) {
      if (this.usrObj.freeLanceDetails.isprofilecompleted) {
        this.stage1Img = this.stageCompletedImg;
      }
      if (this.usrObj.freeLanceDetails.isprofilecompleted && this.usrObj.freeLanceDetails.isregfeedone) {
        this.stage2Img = this.stageCompletedImg;
      }
      if (this.usrObj.freeLanceDetails.isbgstarted) {
        this.stage3Img = this.stageCompletedImg;
      }
      if (this.usrObj.freeLanceDetails.isbgdone) {
        this.stage4Img = this.stageCompletedImg;
      }
      if (this.usrObj.freeLanceDetails.bgcurrentstatus === config.bg_code_approved.toString()) {
        this.stage5Img = this.stageBgStatusApprovedImg;
      } else
        if (this.usrObj.freeLanceDetails.bgcurrentstatus === config.bg_code_rejected.toString()) {
          this.stage5Img = this.stageBgStatusRejectedImg;
        }
    }
  }

  openPaymentComponent() {
    this.modalRef = this.modalService.show(PaymentComponent, {
      initialState: {
        totalAmountToPay: this.referenceobj[0].code,
        displayUserServicesForCheckOut: null,
        productinfoParam: 'Freelancer Reg Fee For PlatForm'
      }
    });
  }

  getUserAllJobDetailsByUserId() {
    this.newJobList = [];
    this.upcomingJobList = [];
    this.completedJobList = [];
    this.spinnerService.show();
    // tslint:disable-next-line: max-line-length
    this.freelanceSvc.getUserAllJobDetails(this.userService.currentUserValue.freeLanceDetails.subCategory).subscribe((resp: FreelanceOnSvc) => {
      this.listofalljobs = resp;
      for (const element of this.listofalljobs) {
        // tslint:disable-next-line: max-line-length
        if (element.isjobactive && !element.isjobaccepted && element.scategory == this.userService.currentUserValue.freeLanceDetails.subCategory) {
          this.newJobList.push(element);
        }
        if (element.freelanceuserId == this.userService.currentUserValue.userId && element.isjobaccepted) {
          this.upcomingJobList.push(element);
        }
        if (element.freelanceuserId == this.userService.currentUserValue.userId
          && element.scategory === this.userService.currentUserValue.freeLanceDetails.subCategory && element.isjobcompleted) {
          this.completedJobList.push(element);
        }
      }
      setTimeout(() => {
        this.builtEarningCard();
        this.spinnerService.hide();
      }, 500);
    },
      error => {
        this.spinnerService.hide();
        this.alertService.error(error);
      });
  }

  builtEarningCard() {
    if (this.completedJobList.length > 0) {
      this.totalEarnings = 0;
      this.earnFlag = false;
      this.completedJobList.forEach(element => {
        if (element.isjobamtpaidtofu) {
          this.totalEarnings = this.totalEarnings + Number.parseFloat(element.tofreelanceamount);
        }
        this.earnFlag = true;
      });
    } else {
      this.totalEarnings = 0;
      this.earnFlag = true;
    }
    if (this.upcomingJobList.length > 0) {
      this.totalupcomingEarnings = 0;
      this.upcomingflag = false;

      this.upcomingJobList.forEach(element => {
        if (element.isupcoming === '1' && element.isjobaccepted) {
          this.totalupcomingEarnings = this.totalupcomingEarnings + Number.parseFloat(element.tofreelanceamount);
        }
        this.upcomingflag = true;
      });
    } else {
      this.totalupcomingEarnings = 0;
      this.upcomingflag = true;
    }

    if (this.earnFlag && this.upcomingflag) {
      this.infoCards = [
        { name: 'Upcoming Pay', value: this.totalupcomingEarnings },
        { name: 'Total Earnings', value: this.totalEarnings },
      ];
    }
  }

  accept(jobId: number) {
    this.spinnerService.show();
    this.freelanceSvc.getAllFreelanceOnServiceDetailsByJobId(jobId).subscribe(
      (freelancedetailsbyId: FreelanceOnSvc) => {
        if (!freelancedetailsbyId.isjobaccepted) {
          freelancedetailsbyId.freelanceuserId = this.userService.currentUserValue.userId;
          freelancedetailsbyId.isjobaccepted = true;
          this.freelanceSvc.saveOrUpdateFreeLanceOnService(freelancedetailsbyId).subscribe((updatedobjfreelanceservice: FreelanceOnSvc) => {
            this.getUserAllJobDetailsByUserId();
            this.spinnerService.hide();
          },
            error => {
              this.spinnerService.hide();
              this.alertService.error(error);
            });
        } else {
          this.spinnerService.hide();
          // tslint:disable-next-line: max-line-length
          this.alertService.error('Sorry ' + this.userService.currentUserValue.firstname + '! This JobId#' + jobId + ' has been accepted by other freelancer');
          this.getUserAllJobDetailsByUserId();
        }
      },
      error => {
        this.spinnerService.hide();
        this.alertService.error(error);
      });
  }

  cancel(jobId: number) {
    this.spinnerService.show();
    this.freelanceSvc.getAllFreelanceOnServiceDetailsByJobId(jobId).subscribe(
      (freelancedetailsbyId: FreelanceOnSvc) => {
        this.cancelminsdiff = 0;
        var todate = new Date();
        var updateon = new Date(freelancedetailsbyId.updatedon);
        this.diff_minutes(todate, updateon);
        if (this.cancelminsdiff <= 15) {
          freelancedetailsbyId.freelanceuserId = null;
          freelancedetailsbyId.isjobaccepted = false;
          freelancedetailsbyId.isjobcancel = false;
          this.freelanceSvc.saveOrUpdateFreeLanceOnService(freelancedetailsbyId).subscribe((updatedobjfreelanceservice: FreelanceOnSvc) => {
            this.getUserAllJobDetailsByUserId();
            this.spinnerService.show();
          },
            error => {
              this.spinnerService.hide();
              this.alertService.error(error);
            });
        } else {
          // tslint:disable-next-line: max-line-length
          this.alertService.error('Cancellation only possible before 15 mins after accepting job .Any concerns, please call our core service support team');
          this.spinnerService.hide();
        }
      },
      error => {
        this.spinnerService.hide();
        this.alertService.error(error);
      });
  }

  diff_minutes(dt2: Date, dt1: Date) {
    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff = diff /= 60;
    this.cancelminsdiff = Math.abs(Math.round(diff));
  }

  autoToastNotificationsForFU() {
    if (this.userService.currentUserValue.userroles.rolecode === config.user_rolecode_fu.toString()) {
      if (!this.userService.currentUserValue.freeLanceDetails.isprofilecompleted) {
        // tslint:disable-next-line: max-line-length
        let msg = 'Hi ' + this.userService.currentUserValue.fullname + ', ' + ConfigMsg.toast_notification_fu_isprofilenotcompelted;
        this.showToastNotificationForFU(msg, this.types[3], 'Profile');
      } else
        if (!this.userService.currentUserValue.freeLanceDetails.isregfeedone) {
          // tslint:disable-next-line: max-line-length
          let msg = 'Hi ' + this.userService.currentUserValue.fullname + ', ' + ConfigMsg.toast_notification_fu_isregfeenotcompelted;
          this.showToastNotificationForFU(msg, this.types[2], 'Payment');
        }
    }
    if (this.upcomingJobList.length < 3 && this.newJobList.length > 0) {
      let msg = 'Hi ' + this.userService.currentUserValue.fullname + ', ' + ConfigMsg.toast_notification_fu_acceptjobmsg.toString();
      this.showToastNotificationForFU(msg, this.types[3], 'Job');
    }

  }
  showToastNotificationForFU(txtmsg: string, typeName: any, toastheader: string) {
    const type = typeName;
    this.toaster.open({
      text: txtmsg,
      caption: toastheader + ' Notification',
      type: type,
    });
  }
}
