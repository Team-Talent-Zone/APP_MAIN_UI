import { Payment } from './../../appmodels/Payment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(
    private http: HttpClient,
  ) { }

  savePayments(payment: Payment) {
    return this.http.post(`${environment.apiUrl}/savePayments/`, payment);
  }

  getPaymentDetailsByTxnId(txnid: string) {
    return this.http.get(`${environment.apiUrl}/getPaymentDetailsByTxnId/` + txnid + '/');
  }

  getPaymentFUDetailsByUserId(userId: number) {
    return this.http.get(`${environment.apiUrl}/getPaymentFUDetailsByUserId/` + userId + '/');
  }

  getPaymentCBADetailsByUserId(userId: number) {
    return this.http.get(`${environment.apiUrl}/getPaymentCBADetailsByUserId/` + userId + '/');
  }
}
