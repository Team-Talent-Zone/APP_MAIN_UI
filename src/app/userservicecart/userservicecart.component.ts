import { UserService } from './../AppRestCall/user/user.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
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

  listOfServicesForCheckOut: any;
  totalAmountToPay: number;
  userservicedetailsList: any;
  isFreeVersion = false;

  constructor(
    public modalRef: BsModalRef,
    public userService: UserService,
    private router: Router,
    private spinnerService: Ng4LoadingSpinnerService,
    private usersrvDetails: UsersrvdetailsService,
    private referService: ReferenceService,
    private alertService: AlertsService,
  ) {
  }

  ngOnInit() {
    this.totalAmountToPay = this.listOfServicesForCheckOut.filter(item => item.subtotal > 0).
      reduce((sum, current) => sum + current.subtotal, 0);
  }

  backToDashBoard() {
    this.modalRef.hide();
    this.router.navigateByUrl('dboard/', { skipLocationChange: true }).
      then(() => {
        this.router.navigate(['dashboard']);
      });
  }

  removeItemFromCart(serviceId: number, packwithotherourserviceid: number) {
    if (serviceId > 0) {
      this.listOfServicesForCheckOut = this.listOfServicesForCheckOut.filter(item => item.serviceId !== serviceId);
      this.deleteUserSVCDetails(serviceId);
    }
    if (packwithotherourserviceid > 0) {
      this.listOfServicesForCheckOut = this.listOfServicesForCheckOut.filter(item => item.serviceId !== packwithotherourserviceid);
      this.deleteUserSVCDetails(packwithotherourserviceid);
    }
  }

  private deleteUserSVCDetails(serviceId: number) {
    if (this.listOfServicesForCheckOut.length > 0) {
      this.callServiceDeleteUserSVCDetails(serviceId);
      this.totalAmountToPay = this.listOfServicesForCheckOut.filter(item => item.subtotal > 0).
        reduce((sum, current) => sum + current.subtotal, 0);
    } else {
      this.callServiceDeleteUserSVCDetails(serviceId);
      this.modalRef.hide();
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

}
