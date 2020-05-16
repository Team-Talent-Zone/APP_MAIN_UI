import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PaymentService } from '../AppRestCall/payment/payment.service';
import { AlertsService } from '../AppRestCall/alerts/alerts.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { UserService } from '../AppRestCall/user/user.service';
import { config } from '../appconstants/config';

@Component({
  selector: 'app-paymenthist',
  templateUrl: './paymenthist.component.html',
  styleUrls: ['./paymenthist.component.css']
})
export class PaymenthistComponent implements OnInit {

  fupaymenthistorydetails: any = [];
  cbapaymenthistorydetails: any = [];
  txnid: string;
  paymentdetails: any;

  constructor(
    public userService: UserService,
    private route: ActivatedRoute,
    public paymentService: PaymentService,
    public alertService: AlertsService,
    public spinnerService: Ng4LoadingSpinnerService,

  ) {
    route.params.subscribe(params => {
      this.txnid = params.txnid;
    });
  }

  ngOnInit() {
    if (this.txnid != null) {
      this.getPaymentDetailsByTxnId(this.txnid);
    }
    if (this.userService.currentUserValue.userroles.rolecode === config.user_rolecode_fu.toString()) {
      this.getPaymentFUDetailsByUserId(this.userService.currentUserValue.userId);
    }

    if (this.userService.currentUserValue.userroles.rolecode === config.user_rolecode_cba.toString()) {
      this.getPaymentCBADetailsByUserId(this.userService.currentUserValue.userId);
    }
  }
  getPaymentDetailsByTxnId(txnid: string) {
    this.spinnerService.show();
    this.paymentService.getPaymentDetailsByTxnId(txnid).subscribe((paymentobj: any) => {
      this.paymentdetails = paymentobj;
      this.spinnerService.hide();
    },
      error => {
        this.spinnerService.hide();
        this.alertService.error(error);
      });
  }

  getPaymentFUDetailsByUserId(userId: number) {
    this.spinnerService.show();
    this.paymentService.getPaymentFUDetailsByUserId(userId).subscribe((fupaymentobjlist: any) => {
      fupaymentobjlist.forEach(element => {
        if (element.status != null) {
          this.fupaymenthistorydetails.push(element);
        }
      });
      this.spinnerService.hide();
    },
      error => {
        this.spinnerService.hide();
        this.alertService.error(error);
      });
  }

  getPaymentCBADetailsByUserId(userId: number) {
    this.spinnerService.show();
    this.paymentService.getPaymentCBADetailsByUserId(userId).subscribe((cbupaymentobjlist: any) => {
      cbupaymentobjlist.forEach(element => {
        if (element.status != null) {
            this.cbapaymenthistorydetails.push(element);
        }
      });
      this.spinnerService.hide();
    },
      error => {
        this.spinnerService.hide();
        this.alertService.error(error);
      });
  }


}
