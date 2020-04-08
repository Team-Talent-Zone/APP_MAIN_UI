import { async } from '@angular/core/testing';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ReferenceService } from './../AppRestCall/reference/reference.service';
import { ManageserviceComponent } from './../manageservice/manageservice.component';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { AlertsService } from './../AppRestCall/alerts/alerts.service';
import { NewsvcService } from './../AppRestCall/newsvc/newsvc.service';
import { NewServiceAdapter } from './../adapters/newserviceadapter';
import { UserService } from './../AppRestCall/user/user.service';
import { Component, OnInit } from '@angular/core';
import { config } from 'src/app/appconstants/config';

@Component({
  selector: 'app-dashboardofcba',
  templateUrl: './dashboardofcba.component.html',
  styleUrls: ['./dashboardofcba.component.css']
})
export class DashboardofcbaComponent implements OnInit {

  newServiceCommentHistory: any = [];
  listOfAllApprovedNewServices: any = [];
  domainRealEstateIndustry: any = [];
  domainServiceProviderObj: any = [];
  show: string = 'show';
  fullContentArray: any = [];

  constructor(
    private referService: ReferenceService,
    public userService: UserService,
    public newsvcservice: NewsvcService,
    private newserviceAdapter: NewServiceAdapter,
    private spinnerService: Ng4LoadingSpinnerService,
    private alertService: AlertsService,
    public manageserviceComponent: ManageserviceComponent,
  ) { }

  ngOnInit() {
    this.manageserviceComponent.getServiceTerms();
    this.getListOfAllActiveServicesByCBAUserId(this.userService.currentUserValue.userId);
    this.getListOfAllActivePlatformServices(this.userService.currentUserValue.preferlang.toString());
  }

  getListOfAllActivePlatformServices(lang: string) {
    this.spinnerService.show();
    this.listOfAllApprovedNewServices = [];
    this.newsvcservice.getAllNewServiceDetails().subscribe(
      (allNewServiceObjs: any) => {
        this.spinnerService.show();
        allNewServiceObjs.forEach((element: any) => {
          this.newServiceCommentHistory.push(this.newserviceAdapter.adapt(element));
          if (element.serviceHistory != null) {
            element.serviceHistory.forEach((elementHis: any) => {
              if (element.currentstatus === elementHis.status &&
                element.currentstatus === config.newservice_code_approved.toString()) {
                element.serviceHistory = [];
                element.serviceHistory.push(elementHis);
                element.fullContent = element.fullContent.split(',');
                element.fullContent.forEach((elementFullContent: any, index: number) => {
                  this.referService.translatetext(elementFullContent, lang).subscribe(
                    (resp: any) => {
                      element.fullContent.splice(index, 1);
                      element.fullContent.splice(index, 0, resp.translateresp);
                    });
                });
                this.referService.translatetext(element.name, lang).subscribe(
                  (servicename: any) => {
                    element.name = servicename.translateresp;
                    this.referService.translatetext(element.description, lang).subscribe(
                      (description: any) => {
                        element.description = description.translateresp;
                        this.manageserviceComponent.serviceterms.forEach(elementterms => {
                          if (elementterms.code === element.validPeriod) {
                            this.referService.translatetext(elementterms.label, lang).subscribe(
                              (validPeriod: any) => {
                                element.validPeriod = validPeriod.translateresp;
                                this.listOfAllApprovedNewServices.push(this.newserviceAdapter.adapt(element));
                                this.mapByDomain(element);
                                this.spinnerService.hide();
                              });
                          }
                        });
                      });
                  });
              }
            });
          }
        });
      },
      error => {
        this.spinnerService.hide();
        this.alertService.error(error);
      });
  }

  mapByDomain(newserviceObj: any) {
    if (this.userService.currentUserValue != null) {
      if (this.userService.currentUserValue.userId > 0) {
        if (newserviceObj.category === config.category_code_A_S.toString()) {
          this.domainRealEstateIndustry.push(newserviceObj);
        }
        if (newserviceObj.category === config.category_code_FS_S.toString()) {
          this.domainServiceProviderObj.push(newserviceObj);
        }
      }
    }
  }

  getListOfAllActiveServicesByCBAUserId(userId: number) {

  }
}
