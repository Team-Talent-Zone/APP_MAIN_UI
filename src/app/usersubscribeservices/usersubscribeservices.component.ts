import { UserServiceDetails } from 'src/app/appmodels/UserServiceDetails';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { UserService } from './../AppRestCall/user/user.service';
import { Component, OnInit } from '@angular/core';
import { UsersrvdetailsService } from '../AppRestCall/userservice/usersrvdetails.service';
import { AlertsService } from '../AppRestCall/alerts/alerts.service';
import { ActivatedRoute, Router } from '@angular/router';
import { config } from 'src/app/appconstants/config';
import { ReferenceService } from '../AppRestCall/reference/reference.service';


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
    private router: Router,
    private alertService: AlertsService,
    private spinnerService: Ng4LoadingSpinnerService,
    private usersrvDetails: UsersrvdetailsService,
    private referService: ReferenceService,
  ) {

  }

  ngOnInit() {
    this.getAllUserServiceDetailsByUserId(this.userService.currentUserValue.userId);
  }

  publishNow(serviceId: number) {
    let objstatus = false;
    if (this.userService.currentUserValue.userbizdetails.bizname === null) {
      this.alertService.error('To Publish , Please Complete The Profile . Go To Edit Profile');
    } else {
      if (this.listOfSubscribedServicesByUser != null) {
        this.spinnerService.show();
        this.usersrvDetails.getUserServiceDetailsByServiceId(serviceId).subscribe((usrserviceobj: UserServiceDetails) => {
          if (usrserviceobj.serviceId == serviceId) {
            usrserviceobj.status = config.user_service_status_published.toString();
            // tslint:disable-next-line: max-line-length
            this.usersrvDetails.saveOrUpdateUserSVCDetails(usrserviceobj).subscribe((obj: any) => {
              if (obj.status === config.user_service_status_published.toString()) {
                this.alertService.success('Published Succesfully. Your site Is Activated');
                this.getAllUserServiceDetailsByUserId(this.userService.currentUserValue.userId);
                this.spinnerService.hide();
              }
            },
              error => {
                this.alertService.error(error);
                this.spinnerService.hide();
              });
          }
        },
          error => {
            this.alertService.error(error);
            this.spinnerService.hide();
          });
      }
    }
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
