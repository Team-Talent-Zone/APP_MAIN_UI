import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PaymentService } from '../AppRestCall/payment/payment.service';
import { AlertsService } from '../AppRestCall/alerts/alerts.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-paymenthist',
  templateUrl: './paymenthist.component.html',
  styleUrls: ['./paymenthist.component.css']
})
export class PaymenthistComponent implements OnInit {
  constructor(
  ) {

  }

  ngOnInit() {

  }



}
