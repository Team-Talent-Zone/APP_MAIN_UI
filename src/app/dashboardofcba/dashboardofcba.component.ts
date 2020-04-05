import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { AlertsService } from './../AppRestCall/alerts/alerts.service';
import { NewsvcService } from './../AppRestCall/newsvc/newsvc.service';
import { NewServiceAdapter } from './../adapters/newserviceadapter';
import { UserService } from './../AppRestCall/user/user.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboardofcba',
  templateUrl: './dashboardofcba.component.html',
  styleUrls: ['./dashboardofcba.component.css']
})
export class DashboardofcbaComponent implements OnInit {

  newServiceCommentHistory: any = [];
  listOfAllApprovedNewServices: any = [];
  constructor(
    public userService: UserService,
    public newsvcservice: NewsvcService,
    private newserviceAdapter: NewServiceAdapter,
    private spinnerService: Ng4LoadingSpinnerService,
    private alertService: AlertsService,
  ) { }

  ngOnInit() {
    this.getListOfAllActiveServicesByCBAUserId(this.userService.currentUserValue.userId);
    this.getListOfAllActivePlatformServices();
  }

  getListOfAllActivePlatformServices() {
    this.spinnerService.show();
    this.newsvcservice.getAllNewServiceDetails().subscribe(
      (allNewServiceObjs: any) => {
        allNewServiceObjs.forEach((element: any) => {
          this.newServiceCommentHistory.push(this.newserviceAdapter.adapt(element));
          if (element.serviceHistory != null) {
            element.serviceHistory.forEach((elementHis: any) => {
              if (element.currentstatus === elementHis.status && element.currentstatus === 'APPROVED') {
                element.serviceHistory = [];
                element.serviceHistory.push(elementHis);
                this.listOfAllApprovedNewServices.push(this.newserviceAdapter.adapt(element));
              }
            });
          }
        });
        this.spinnerService.hide();
        console.log('this.listOfAllApprovedNewServices' ,this.listOfAllApprovedNewServices);
      },
      error => {
        this.spinnerService.hide();
        this.alertService.error(error);
      });
  }

  getListOfAllActiveServicesByCBAUserId(userId: number) {

  }

}
