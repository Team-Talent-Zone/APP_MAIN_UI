import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { UserService } from './../AppRestCall/user/user.service';
import { Component, OnInit } from '@angular/core';
import { ManageserviceComponent } from '../manageservice/manageservice.component';
import { DashboardofcbaComponent } from '../dashboardofcba/dashboardofcba.component';
import { UsersrvdetailsService } from '../AppRestCall/userservice/usersrvdetails.service';
import { AlertsService } from '../AppRestCall/alerts/alerts.service';
import { ActivatedRoute } from '@angular/router';
import { PaymentService } from '../AppRestCall/payment/payment.service';

@Component({
  selector: 'app-usersubscribeservices',
  templateUrl: './usersubscribeservices.component.html',
  styleUrls: ['./usersubscribeservices.component.css']
})
export class UsersubscribeservicesComponent implements OnInit {

  listOfSubscribedServicesByUser: any = [];
  fullContent: any = [];
  istimelap = false;
  id: string;

  constructor(
    public userService: UserService,
    private route: ActivatedRoute,
    private alertService: AlertsService,
    private spinnerService: Ng4LoadingSpinnerService,
    private usersrvDetails: UsersrvdetailsService
  ) {

  }

  ngOnInit() {
    this.getAllUserServiceDetailsByUserId(this.userService.currentUserValue.userId);
  }


  /** The below method will fetch all the user service for the user id */
  getAllUserServiceDetailsByUserId(userId: number) {
    this.spinnerService.show();
    this.usersrvDetails.getAllUserServiceDetailsByUserId(userId).subscribe(
      (listofusersrvDetails: any) => {
        if (listofusersrvDetails != null) {
          listofusersrvDetails.forEach((element: any) => {
            if (element.isservicepurchased) {
              var array = element.fullcontent.split(',');
              element.fullcontent = array;
              this.listOfSubscribedServicesByUser.push(element);
            }
          });
          this.spinnerService.hide();
        }
        this.istimelap = true;
      },
      error => {
        this.alertService.error(error);
        this.spinnerService.hide();
      });
  }
}
