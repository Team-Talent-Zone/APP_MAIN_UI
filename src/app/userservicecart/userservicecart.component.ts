import { UserService } from './../AppRestCall/user/user.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { UsersrvdetailsService } from '../AppRestCall/userservice/usersrvdetails.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ReferenceService } from '../AppRestCall/reference/reference.service';
import { config } from 'src/app/appconstants/config';
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
    this.totalAmountToPay = this.listOfServicesForCheckOut.filter(item => item.amount > 0).
      reduce((sum, current) => sum + current.amount, 0);
  }

  backToDashBoard() {
    this.modalRef.hide();
    this.router.navigateByUrl('dboard/', { skipLocationChange: true }).
      then(() => {
        this.router.navigate(['dashboard']);
      });
  }

  removeItemFromCart(serviceId: number) {
    this.listOfServicesForCheckOut = this.listOfServicesForCheckOut.filter(item => item.serviceId !== serviceId);
    if (this.listOfServicesForCheckOut.length > 0) {
      this.prepareSaveOrUpdateUserSVCDetails(serviceId);
      this.totalAmountToPay = this.listOfServicesForCheckOut.filter(item => item.amount > 0).
        reduce((sum, current) => sum + current.amount, 0);
    } else {
      this.prepareSaveOrUpdateUserSVCDetails(serviceId);
      this.modalRef.hide();
      this.router.navigateByUrl('dboard/', { skipLocationChange: true }).
        then(() => {
          this.router.navigate(['dashboard']);
        });
    }

  }

  private prepareSaveOrUpdateUserSVCDetails(serviceId: number) {
    this.userservicedetailsList.forEach(element => {
      if (element.serviceId === serviceId) {
        element.isactive = false;
        this.spinnerService.show();
        this.referService.getReferenceLookupByShortKey(config.cba_service_event_remove_shortkey.toString()).subscribe(
          (refCodeStr: string) => {
            element.status = refCodeStr;
            element.userServiceEventHistory[0].eventcode = refCodeStr;
            element.userServiceEventHistory[0].updatedby = this.userService.currentUserValue.fullname;
            this.usersrvDetails.saveOrUpdateUserSVCDetails(element).subscribe(() => {
              this.spinnerService.hide();
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
