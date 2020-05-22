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
import { FreelanceOnSvcAdapter } from '../adapters/freelanceonsvcadapter';
import { subscribeOn } from 'rxjs/operators';

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


  infoCards = [
    { name: 'Upcoming Pay', value: '1000' },
    { name: 'Total Earnings', value: '10000' },
  ];

  constructor(
    public userService: UserService,
    private referService: ReferenceService,
    private referenceadapter: ReferenceAdapter,
    private modalRef: BsModalRef,
    private modalService: BsModalService,
    private spinnerService: Ng4LoadingSpinnerService,
    private alertService: AlertsService,
    private freelanceSvc: FreelanceOnSvcService,
  ) { }

  ngOnInit() {
    this.displayFUDetailsInCards();
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

  displayFUDetailsInCards() {

    this.newJobList = [];
    this.upcomingJobList = [];
    this.completedJobList = [];
    this.spinnerService.show();
    this.freelanceSvc.getUserAllJobDetails(this.userService.currentUserValue.freeLanceDetails.subCategory).subscribe((resp: any) => {
      this.listofalljobs = resp;
      for (let element of this.listofalljobs) {
        if (element.isjobactive && !element.isjobaccepted && element.scategory == this.userService.currentUserValue.freeLanceDetails.subCategory) {
          this.newJobList.push(element);
        }
        if (element.freelanceuserId == this.userService.currentUserValue.freeLanceDetails.freeLanceId && element.isjobaccepted) {
          this.upcomingJobList.push(element);
        }
        if (element.isjobamtpaidtofu && element.freelanceuserId == this.userService.currentUserValue.userId
          && element.scategory == this.userService.currentUserValue.freeLanceDetails.subCategory) {
          element.isjobcompleted = true;
          this.completedJobList.push(element);
        }
      }
      this.spinnerService.hide();

    },
      error => {
        this.spinnerService.hide();
        this.alertService.error(error);
      });
  }

  updateUserOnAccept(jobId: number) {
      this.freelanceSvc.getAllFreelanceOnServiceDetailsByJobId(jobId).subscribe(
        (freelancedetailsbyId: FreelanceOnSvc) => {
          if (freelancedetailsbyId.isjobaccepted == false) {
            freelancedetailsbyId.freelanceuserId = this.userService.currentUserValue.freeLanceDetails.freeLanceId;
            freelancedetailsbyId.isjobaccepted = true;
            console.log("resp from restapi :", freelancedetailsbyId);
            this.freelanceSvc.saveOrUpdateFreeLanceOnService(freelancedetailsbyId).subscribe((updatedobjfreelanceservice: FreelanceOnSvc) => {
              this.displayFUDetailsInCards();
            },
              error => {
                this.spinnerService.hide();
                this.alertService.error(error);
              });
          }
          else {
            this.alertService.error("Sorry! This jobs has been accepted")
            this.displayFUDetailsInCards();
          }
        },
        error => {
          this.spinnerService.hide();
          this.alertService.error(error);
        });
  }

  updateUserOnCancel(jobId: number) {

    this.freelanceSvc.getAllFreelanceOnServiceDetailsByJobId(jobId).subscribe(
      (freelancedetailsbyId: FreelanceOnSvc) => {
        freelancedetailsbyId.freelanceuserId = null;
        freelancedetailsbyId.isjobaccepted = false;
        console.log("resp from restapi :", freelancedetailsbyId);
        this.freelanceSvc.saveOrUpdateFreeLanceOnService(freelancedetailsbyId).subscribe((updatedobjfreelanceservice: FreelanceOnSvc) => {
          this.displayFUDetailsInCards();
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
