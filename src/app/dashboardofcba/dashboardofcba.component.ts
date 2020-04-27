import { UserservicecartComponent } from './../userservicecart/userservicecart.component';
import { ReferenceService } from './../AppRestCall/reference/reference.service';
import { ManageserviceComponent } from './../manageservice/manageservice.component';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { AlertsService } from './../AppRestCall/alerts/alerts.service';
import { NewsvcService } from './../AppRestCall/newsvc/newsvc.service';
import { NewServiceAdapter } from './../adapters/newserviceadapter';
import { UserService } from './../AppRestCall/user/user.service';
import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { config } from 'src/app/appconstants/config';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UsersrvdetailsService } from '../AppRestCall/userservice/usersrvdetails.service';
import { BsModalService, ModalOptions, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';

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
  @Input() userservicedetailsList: any;
  @Input() userservicedetailsExistingIds: any;
  config: ModalOptions = {
    class: 'modal-lg', backdrop: 'static',
    keyboard: false
  };
  modalRef: BsModalRef;
  userservicedetailsForm: FormGroup;
  listOfServicesForCheckOut: any = [];

  constructor(
    private referService: ReferenceService,
    public userService: UserService,
    public newsvcservice: NewsvcService,
    private newserviceAdapter: NewServiceAdapter,
    private spinnerService: Ng4LoadingSpinnerService,
    private alertService: AlertsService,
    public manageserviceComponent: ManageserviceComponent,
    private formBuilder: FormBuilder,
    private usersrvDetails: UsersrvdetailsService,
    private router: Router,
    private modalService: BsModalService,
  ) { }

  ngOnInit() {
    this.manageserviceComponent.getServiceTerms();
    this.getListOfAllActivePlatformServices(this.userService.currentUserValue.preferlang.toString());
  }

  getListOfAllActivePlatformServices(lang: string) {
    this.listOfAllApprovedNewServices = [];
    this.domainRealEstateIndustry = [];
    this.domainServiceProviderObj = [];
    this.spinnerService.show();
    this.newsvcservice.getAllNewServiceDetails().subscribe(
      (allNewServiceObjs: any) => {
        allNewServiceObjs.forEach((element: any) => {
          this.newServiceCommentHistory.push(this.newserviceAdapter.adapt(element));
          if (element.serviceHistory != null) {
            element.serviceHistory.forEach((elementHis: any) => {
              if (element.currentstatus === elementHis.status &&
                element.currentstatus === config.newservice_code_approved.toString()) {
                element.serviceHistory = [];
                element.serviceHistory.push(elementHis);
                element.fullContent = element.fullContent.split(',');
                if (lang !== config.default_prefer_lang.toString()) {
                  this.spinnerService.show();
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
                } else {
                  element.fullContent.forEach((elementFullContent: any, index: number) => {
                    element.fullContent.splice(index, 1);
                    element.fullContent.splice(index, 0, elementFullContent);
                  });
                  this.manageserviceComponent.serviceterms.forEach(elementterms => {
                    if (elementterms.code === element.validPeriod) {
                      element.validPeriod = elementterms.label;
                      this.listOfAllApprovedNewServices.push(this.newserviceAdapter.adapt(element));
                      this.mapByDomain(element);
                      this.spinnerService.hide();
                    }
                  });
                }
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
      if (this.userService.currentUserValue.userId > 0 &&
        this.userService.currentUserValue.userroles.rolecode === config.user_rolecode_cba.toString()) {
        if (newserviceObj.category === config.category_code_A_S.toString()) {
          this.domainRealEstateIndustry.push(newserviceObj);
        }
        if (newserviceObj.category === config.category_code_FS_S.toString()) {
          this.domainServiceProviderObj.push(newserviceObj);
        }
      }
    }
  }

  saveUserServiceForServiceId(ourserviceid: number) {
    this.spinnerService.show();
    this.referService.getReferenceLookupByShortKey(config.cba_service_event_add_shortkey.toString()).subscribe(
      (refCodeStr: string) => {
        this.userservicedetailsForm = this.formBuilder.group({
          ourserviceId: ourserviceid,
          userid: this.userService.currentUserValue.userId,
          createdby: this.userService.currentUserValue.fullname,
          status: refCodeStr,
          userServiceEventHistory: []
        });
        this.usersrvDetails.saveUserServiceDetails(this.userservicedetailsForm.value, refCodeStr).subscribe(() => {
          this.spinnerService.hide();
          this.router.navigateByUrl('addtocart/', { skipLocationChange: true }).
            then(() => {
              this.router.navigate(['dashboard']);
            });
        },
          error => {
            this.spinnerService.hide();
            this.alertService.error(error);
          }
        );
      },
      error => {
        this.spinnerService.hide();
        this.alertService.error(error);
      });
  }
  openUserServiceCart() {
    this.listOfServicesForCheckOut = [];
    this.listOfAllApprovedNewServices.forEach(elementAppService => {
      this.userservicedetailsList.forEach(element => {
        if (element.ourserviceId === elementAppService.ourserviceId) {
          this.listOfServicesForCheckOut.push({
            serviceId: element.serviceId,
            name: elementAppService.name,
            imageUrl: elementAppService.imageUrl,
            description: elementAppService.description,
            amount: elementAppService.amount,
            validPeriod: elementAppService.validPeriod
          });
        }
      });
    });
    const initialState = {
      listOfServicesForCheckOut: this.listOfServicesForCheckOut,
      userservicedetailsList: this.userservicedetailsList
    };
    this.modalRef = this.modalService.show(UserservicecartComponent, Object.assign(
      {},
      this.config,
      {
        initialState
      }
    )
    );
  }

}
