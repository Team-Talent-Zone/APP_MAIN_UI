import { UsersrvdetailsService } from './../AppRestCall/userservice/usersrvdetails.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertsService } from '../AppRestCall/alerts/alerts.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-viewuserservicedetails',
  templateUrl: './viewuserservicedetails.component.html',
  styleUrls: ['./viewuserservicedetails.component.css']
})
export class ViewuserservicedetailsComponent implements OnInit {
  userId: number;
  userservicedetails: any = [];

  constructor(
    private route: ActivatedRoute,
    private alertService: AlertsService,
    private spinnerService: Ng4LoadingSpinnerService,
    private usersrvDetails: UsersrvdetailsService
  ) {
    route.params.subscribe(params => {
      this.userId = params.id;
    });
  }

  ngOnInit() {
    if (this.userId > 0) {
      this.getAllUserServiceDetailsByUserId(this.userId);
    }
  }
  getAllUserServiceDetailsByUserId(userId: number) {
    this.spinnerService.show();
    this.usersrvDetails.getAllUserServiceDetailsByUserId(userId).subscribe(
      (listofusersrvDetails: any) => {
        if (listofusersrvDetails != null) {
          listofusersrvDetails.forEach((element: any) => {
            this.userservicedetails.push(element);
          });
        }
      });
  }
}
