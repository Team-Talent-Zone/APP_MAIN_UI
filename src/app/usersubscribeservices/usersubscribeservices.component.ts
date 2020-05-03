import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { UserService } from './../AppRestCall/user/user.service';
import { Component, OnInit } from '@angular/core';
import { ManageserviceComponent } from '../manageservice/manageservice.component';
import { DashboardofcbaComponent } from '../dashboardofcba/dashboardofcba.component';
import { UsersrvdetailsService } from '../AppRestCall/userservice/usersrvdetails.service';
import { AlertsService } from '../AppRestCall/alerts/alerts.service';

@Component({
  selector: 'app-usersubscribeservices',
  templateUrl: './usersubscribeservices.component.html',
  styleUrls: ['./usersubscribeservices.component.css']
})
export class UsersubscribeservicesComponent implements OnInit {

  listOfSubscribedServicesByUser: any = [];
  timelaps = false;
  constructor(
    public userService: UserService,
    public manageserviceComponent: ManageserviceComponent,
    public dashboardofcbaComponent: DashboardofcbaComponent,
    private usersrvDetails: UsersrvdetailsService,
    private alertService: AlertsService,
    private spinnerService: Ng4LoadingSpinnerService,
  ) { }

  ngOnInit() {
    this.manageserviceComponent.getServiceTerms();
    this.dashboardofcbaComponent.getListOfAllActivePlatformServices(this.userService.currentUserValue.preferlang.toString());
    setTimeout(() => {
      this.getAllUserServiceDetailsByUserId(this.userService.currentUserValue.userId);
    }, 500);
  }

  getAllUserServiceDetailsByUserId(userId: number) {
    this.spinnerService.show();
    this.usersrvDetails.getAllUserServiceDetailsByUserId(userId).subscribe(
      (listofusersrvDetails: any) => {
        if (listofusersrvDetails != null) {
          listofusersrvDetails.forEach(elementSubServices => {
            this.dashboardofcbaComponent.listOfAllApprovedNewServices.forEach(element => {
              if (elementSubServices.ourserviceId === element.ourserviceId &&
                elementSubServices.isservicepurchased) {
                var list = {
                  name: element.name,
                  imageUrl: element.imageUrl,
                  amount: element.amount,
                  validPeriod: element.validPeriod,
                  fullContent: element.fullContent,
                  ourserviceId: element.ourserviceId,
                  status: elementSubServices.status,
                  category: element.category
                };
                this.listOfSubscribedServicesByUser.push(list);
              }
            });
          });
        }
        this.timelaps = true;
        this.spinnerService.hide();
      },
      error => {
        this.alertService.error(error);
        this.spinnerService.hide();
      }
    );
  }
}
