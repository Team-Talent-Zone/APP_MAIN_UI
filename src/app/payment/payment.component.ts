import { BsModalRef } from 'ngx-bootstrap/modal';
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../AppRestCall/user/user.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  payuForm: FormGroup;
  @Input() totalAmountToPay: number;
  issubmit = false;
  productinfoJSON: [];
  disablePaymentButton: boolean = true;


  constructor(
    public modalRef: BsModalRef,
    private formBuilder: FormBuilder,
    private userService: UserService,

  ) { }

  ngOnInit() {
    console.log('productinfoJSON : ', this.productinfoJSON);
    this.paymentValidationForm();
    this.populatePaymentDetails();
  }

  populatePaymentDetails() {
    this.payuForm.patchValue({ email: this.userService.currentUserValue.username });
    this.payuForm.patchValue({ firstname: this.userService.currentUserValue.fullname });
    this.payuForm.patchValue({ amount: this.totalAmountToPay });
    this.payuForm.patchValue({ productInfo: this.productinfoJSON });
  }

  paymentValidationForm() {
    this.payuForm = this.formBuilder.group({
      phnumber: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.maxLength(10)]],
      email: [],
      firstname: [],
      amount: [],
      productInfo: [],
      surl: [],
      furl: [],
      key: [],
      hash: [],
      txnid: [],
      service_provider: []
    });
  }

  get f() {
    return this.payuForm.controls;
  }
  confirmPayment() {
    this.issubmit = true;
    if (this.payuForm.invalid) {
      return;
    }
    this.disablePaymentButton = false;

  }

}
