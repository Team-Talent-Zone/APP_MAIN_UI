import { PaymentComponent } from './../payment/payment.component';
import { UserService } from './../AppRestCall/user/user.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { UsersrvdetailsService } from '../AppRestCall/userservice/usersrvdetails.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ReferenceService } from '../AppRestCall/reference/reference.service';
import { AlertsService } from '../AppRestCall/alerts/alerts.service';

@Component({
  selector: 'app-userservicecart',
  templateUrl: './userservicecart.component.html',
  styleUrls: ['./userservicecart.component.css']
})
export class UserservicecartComponent implements OnInit {

  displayUserServicesForCheckOut: any;
  totalAmountToPay: number;
  userservicedetailsList: any;
  isFreeVersion = false;

  constructor(
    private modalRefUserSvc: BsModalRef,
    private modalRef: BsModalRef,
    public userService: UserService,
    private router: Router,
    private spinnerService: Ng4LoadingSpinnerService,
    private usersrvDetails: UsersrvdetailsService,
    private referService: ReferenceService,
    private alertService: AlertsService,
    private modalService: BsModalService,
  ) {
  }

  ngOnInit() {
    this.totalAmountToPay = this.displayUserServicesForCheckOut.filter(item => item.subtotal > 0).
      reduce((sum, current) => sum + current.subtotal, 0);
  }

  backToDashBoard() {
    this.modalRefUserSvc.hide();
    this.router.navigateByUrl('dboard/', { skipLocationChange: true }).
      then(() => {
        this.router.navigate(['dashboard']);
      });
  }

  removeItemFromCart(serviceId: number, packwithotherourserviceid: number) {
    if (serviceId > 0) {
      this.displayUserServicesForCheckOut = this.displayUserServicesForCheckOut.filter(item => item.serviceId !== serviceId);
      this.deleteUserSVCDetails(serviceId);
    }
    if (packwithotherourserviceid > 0) {
      // tslint:disable-next-line: max-line-length
      this.displayUserServicesForCheckOut = this.displayUserServicesForCheckOut.filter(item => item.serviceId !== packwithotherourserviceid);
      this.deleteUserSVCDetails(packwithotherourserviceid);
    }
  }

  private deleteUserSVCDetails(serviceId: number) {
    if (this.displayUserServicesForCheckOut.length > 0) {
      this.callServiceDeleteUserSVCDetails(serviceId);
      this.totalAmountToPay = this.displayUserServicesForCheckOut.filter(item => item.subtotal > 0).
        reduce((sum, current) => sum + current.subtotal, 0);
    } else {
      this.callServiceDeleteUserSVCDetails(serviceId);
      this.modalRefUserSvc.hide();
      this.router.navigateByUrl('dboard/', { skipLocationChange: true }).
        then(() => {
          this.router.navigate(['dashboard']);
        });
    }
  }
  private callServiceDeleteUserSVCDetails(serviceId: number) {
    this.userservicedetailsList.forEach(element => {
      if (element.serviceId === serviceId) {
        this.usersrvDetails.deleteUserSVCDetails(element).subscribe(() => {
          this.spinnerService.hide();
        },
          error => {
            this.spinnerService.hide();
            this.alertService.error(error);
          });
      }
    });
  }

  saveorUpdateFreeVersionUserServiceDetails() {
    this.isFreeVersion = true;
  }
  openPaymentComponent(amount: number) {
    this.modalRef = this.modalService.show(PaymentComponent, {
      initialState: {
        totalAmountToPay: amount,
        displayUserServicesForCheckOut: this.displayUserServicesForCheckOut
      }
    });
  }

}
