import { Payment } from './../appmodels/Payment';
import { PaymentService } from './../AppRestCall/payment/payment.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../AppRestCall/user/user.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { AlertsService } from '../AppRestCall/alerts/alerts.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  @Input() totalAmountToPay: number;
  @Input() displayUserServicesForCheckOut: any;
  @Input() productinfoParam: string;

  issubmit = false;
  productinfoJSON: [];
  disablePaymentButton: boolean = true;
  public payuform: any = {};
  paymentFormDetails: FormGroup;
  productinfo = '';


  constructor(
    public modalRef: BsModalRef,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private payment: PaymentService,
    private spinnerService: Ng4LoadingSpinnerService,
    private alertService: AlertsService,
  ) { }

  ngOnInit() {
    if (this.displayUserServicesForCheckOut != null) {
      this.displayUserServicesForCheckOut.forEach((element: { name: any; description: any; }) => {
        this.productinfo = this.productinfo + '|' + element.name + '|';
      });
    } else {
      this.productinfo = this.productinfoParam;
    }
    console.log('1', this.productinfo);
  }

  confirmPayment() {
    var phonenoreg = new RegExp('^[0-9]*$');

    if (this.payuform.phone == null || this.payuform.phone.length === 0) {
      this.alertService.error('Enter Mobile number');

    } else
      if (this.payuform.phone != null && (this.payuform.phone.length > 10 || this.payuform.phone.length < 10)) {
        this.alertService.error('Mobile number must be 10 digits');

      } else {
        if (phonenoreg.test(this.payuform.phone)) {
          this.paymentFormDetails = this.formBuilder.group({
            email: this.userService.currentUserValue.username,
            name: this.userService.currentUserValue.fullname,
            phone: this.payuform.phone,
            productinfo: this.productinfo,
            amount: this.totalAmountToPay,
            serviceId: 250,
            userId: 211
          });
          this.payment.savePayments(this.paymentFormDetails.value).subscribe(
            (data: Payment) => {
              this.disablePaymentButton = false;
              console.log('paymentPayload : ', data);
              this.payuform.txnid = data.txnid;
              this.payuform.surl = data.surl;
              this.payuform.furl = data.furl;
              this.payuform.key = data.key;
              this.payuform.hash = data.hash;
              this.payuform.txnid = data.txnid;
              this.payuform.service_provider = data.service_provider;
              this.payuform.email = data.email;
              this.payuform.firstname = data.name;
              this.payuform.amount = data.amount;
              this.payuform.phone = data.phone;
              this.payuform.productInfo = data.productinfo;
            },
            error => {
              this.spinnerService.hide();
              this.alertService.error(error);
            });
        } else {
          this.alertService.error('Enter only digits');
        }
      }
  }
}
