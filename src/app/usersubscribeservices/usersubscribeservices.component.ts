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
    if (this.userService.currentUserValue.userbizdetails.bizname === null) {
      this.alertService.error('To Publish , Please Complete The Profile . Go To Edit Profile');
    } else {
      if (this.listOfSubscribedServicesByUser != null) {
        this.usersrvDetails.getUserServiceDetailsByServiceId(serviceId).subscribe((usrserviceobj: UserServiceDetails) => {
          if (usrserviceobj.serviceId == serviceId) {
            usrserviceobj.status = config.user_service_status_published.toString();
            this.spinnerService.show();
            this.referService.getReferenceLookupByKey(config.key_apartmentservice_url.toString()).subscribe((refobj: any) => {
              // tslint:disable-next-line: max-line-length
              usrserviceobj.publishedlinkurl = refobj[0].code + '/' + this.userService.currentUserValue.userbizdetails.bizname + '/' + this.userService.currentUserValue.uniqueidentificationcode
              this.usersrvDetails.saveOrUpdateUserSVCDetails(usrserviceobj).subscribe((obj: any) => {
                this.router.navigateByUrl('dashboard/', { skipLocationChange: true }).
                  then(() => {
                    this.router.navigate(['usersubscribeservices/']);
                  });
                this.alertService.success('Published Succesfully. You Personal site is activated');
                this.spinnerService.hide();
              },
                error => {
                  this.alertService.error(error);
                  this.spinnerService.hide();
                });
            },
              error => {
                this.alertService.error(error);
                this.spinnerService.hide();
              }
            );
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
