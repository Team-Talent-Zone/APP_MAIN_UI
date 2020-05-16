import { UserServiceDetails } from 'src/app/appmodels/UserServiceDetails';
import { UserservicecartComponent } from './../userservicecart/userservicecart.component';
import { ReferenceService } from './../AppRestCall/reference/reference.service';
import { ManageserviceComponent } from './../manageservice/manageservice.component';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { AlertsService } from './../AppRestCall/alerts/alerts.service';
import { NewsvcService } from './../AppRestCall/newsvc/newsvc.service';
import { NewServiceAdapter } from './../adapters/newserviceadapter';
import { UserService } from './../AppRestCall/user/user.service';
import { Component, OnInit, Input } from '@angular/core';
import { config } from 'src/app/appconstants/config';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UsersrvdetailsService } from '../AppRestCall/userservice/usersrvdetails.service';
import { BsModalService, ModalOptions, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { UserServicedetailsAdapter } from '../adapters/userserviceadapter';

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
  userservicedetailsList: any = [];
  userservicedetailsAddedList: any = [];
  userservicedetailsExistingIds: any = [];

  config: ModalOptions = {
    class: 'modal-lg', backdrop: 'static',
    keyboard: false
  };
  modalRef: BsModalRef;
  userservicedetailsForm: FormGroup;
  userservicedetailsFormServicePack: FormGroup;
  listOfServicesForCheckOut: any = [];
  fullContent: any[];

  constructor(
    private referService: ReferenceService,
    public userService: UserService,
    public newsvcservice: NewsvcService,
    private spinnerService: Ng4LoadingSpinnerService,
    private alertService: AlertsService,
    public manageserviceComponent: ManageserviceComponent,
    private formBuilder: FormBuilder,
    private usersrvDetails: UsersrvdetailsService,
    private router: Router,
    private modalService: BsModalService,
  ) {
  }

  ngOnInit() {
    this.getListOfAllActivePlatformServices(this.userService.currentUserValue.preferlang.toString());
    setTimeout(() => {
      this.getAllUserServiceDetailsByUserId(this.userService.currentUserValue.userId);
    }, 500);
  }

  getAllUserServiceDetailsByUserId(userId: number) {
    this.userservicedetailsList = [];
    this.userservicedetailsExistingIds = [];
    this.userservicedetailsAddedList = [];
    this.spinnerService.show();
    this.usersrvDetails.getAllUserServiceDetailsByUserId(userId).subscribe(
      (listofusersrvDetails: any) => {
        if (listofusersrvDetails != null) {
          listofusersrvDetails.forEach((element: any) => {
            this.userservicedetailsList.push(element);
            this.userservicedetailsExistingIds.push(element.ourserviceId);
            if (element.status === config.user_service_status_paymentpending.toString()) {
              this.userservicedetailsAddedList.push(element);
            }
            this.spinnerService.hide();
          });
        }
      },
      error => {
        this.alertService.error(error);
        this.spinnerService.hide();
      });
  }

  getListOfAllActivePlatformServices(lang: string) {
    this.listOfAllApprovedNewServices = [];
    this.domainRealEstateIndustry = [];
    this.domainServiceProviderObj = [];
    this.spinnerService.show();
    this.newsvcservice.getAllNewServiceDetails().subscribe(
      (allNewServiceObjs: any) => {
        allNewServiceObjs.forEach(element => {
          var array = element.fullcontent.split(',');
          element.fullcontent = array;
          this.listOfAllApprovedNewServices.push(element);
          this.mapByDomain(element);
          this.spinnerService.hide();
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

  // tslint:disable-next-line: max-line-length
  prepareSaveUserServiceForServiceId(ourserviceid: number, packwithotherourserviceid: number, amount: number, validPeriodLabel: string, validPeriodCode: string, serviceendon: string, servicestarton: string) {
    let isServiceAlreadyExist = false;
    var isInsideCart = this.userservicedetailsAddedList.filter(item => item.ourserviceId === packwithotherourserviceid);
    if (isInsideCart.length > 0) {
      // tslint:disable-next-line: max-line-length
      this.alertService.error(isInsideCart[0].name + 'is a part of this package . We have found ' + isInsideCart[0].name + 'as individual service in the cart.Please remove the ' + isInsideCart[0].name + ' from the cart before adding this package');
      isServiceAlreadyExist = true;
    } else {
      var isAlreadySubService = this.userservicedetailsList.filter(item => item.ourserviceId === packwithotherourserviceid);
      if (isAlreadySubService.length > 0) {
        // tslint:disable-next-line: max-line-length
        this.alertService.error(isAlreadySubService[0].name + 'is a part of this package . We have found ' + isAlreadySubService[0].name + 'as individual service already been subscribed.');
        isServiceAlreadyExist = true;
      }
    }


    if (!isServiceAlreadyExist) {
      if (packwithotherourserviceid != null) {
        // tslint:disable-next-line: max-line-length
        this.saveUserServiceDetailsForServicePkg(packwithotherourserviceid, ourserviceid, amount, validPeriodLabel, validPeriodCode, serviceendon, servicestarton);
      } else {
        this.saveUserServiceDetailsForIndividual(ourserviceid, amount, validPeriodLabel, validPeriodCode, serviceendon, servicestarton);
      }
    }
  }

  // tslint:disable-next-line: max-line-length
  private saveUserServiceDetailsForIndividual(ourserviceid: number, amountval: number, validPeriodLabelVal: string, validPeriodCodeVal: string, serviceendonval: string, servicestartonval: string) {
    this.spinnerService.show();
    this.referService.getReferenceLookupByShortKey(config.user_service_status_paymentpending_shortkey.toString()).subscribe(
      (refCodeStr: string) => {
        this.userservicedetailsForm = this.formBuilder.group({
          ourserviceId: ourserviceid,
          userid: this.userService.currentUserValue.userId,
          createdby: this.userService.currentUserValue.fullname,
          status: refCodeStr,
          isservicepack: false,
          isservicepurchased: false,
          amount: amountval,
          validPeriodLabel: validPeriodLabelVal,
          validPeriodCode: validPeriodCodeVal,
          servicestarton: servicestartonval,
          serviceendon: serviceendonval,
          userServiceEventHistory: []
        });
        this.usersrvDetails.saveUserServiceDetails(this.userservicedetailsForm.value, refCodeStr).subscribe(
          (usersrvobj) => {
            this.spinnerService.hide();
            this.router.navigateByUrl('addtocart/', { skipLocationChange: true }).
              then(() => {
                this.router.navigate(['dashboard']);
              });
          }, error => {
            this.spinnerService.hide();
            this.alertService.error(error);
          });
      });
  }
  // tslint:disable-next-line: max-line-length
  private saveUserServiceDetailsForServicePkg(packwithotherourserviceid: number, ourserviceid: number, amountval: number, validPeriodLabelVal: string, validPeriodCodeVal: string, serviceendonval: string, servicestartonval: string) {
    this.spinnerService.show();
    this.referService.getReferenceLookupByShortKey(config.user_service_status_paymentpending_shortkey.toString()).subscribe(
      (refCodeStr: string) => {
        this.userservicedetailsFormServicePack = this.formBuilder.group({
          ourserviceId: packwithotherourserviceid,
          userid: this.userService.currentUserValue.userId,
          createdby: this.userService.currentUserValue.fullname,
          status: refCodeStr,
          isservicepack: true,
          isservicepurchased: false,
          amount: 0,
          validPeriodLabel: validPeriodLabelVal,
          validPeriodCode: validPeriodCodeVal,
          servicestarton: servicestartonval,
          serviceendon: serviceendonval,
          userServiceEventHistory: []
        });
        this.usersrvDetails.saveUserServiceDetails(this.userservicedetailsFormServicePack.value, refCodeStr).subscribe(
          (servicepkgusersrvobj: UserServiceDetails) => {
            this.userservicedetailsForm = this.formBuilder.group({
              ourserviceId: ourserviceid,
              userid: this.userService.currentUserValue.userId,
              createdby: this.userService.currentUserValue.fullname,
              status: refCodeStr,
              isservicepack: false,
              childservicepkgserviceid: servicepkgusersrvobj.serviceId,
              amount: amountval,
              validPeriodLabel: validPeriodLabelVal,
              validPeriodCode: validPeriodCodeVal,
              servicestarton: servicestartonval,
              serviceendon: serviceendonval,
              userServiceEventHistory: []
            });
            this.usersrvDetails.saveUserServiceDetails(this.userservicedetailsForm.value, refCodeStr).subscribe(
              () => {
                this.spinnerService.hide();
                this.router.navigateByUrl('addtocart/', { skipLocationChange: true }).
                  then(() => {
                    this.router.navigate(['dashboard']);
                  });
              },
              error => {
                this.spinnerService.hide();
                this.alertService.error(error);
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
    this.userservicedetailsAddedList.forEach(element => {
      this.listOfServicesForCheckOut.push({
        serviceId: element.serviceId,
        name: element.name,
        imageUrl: element.imgurl,
        description: element.description,
        amount: element.amount,
        isservicepack: element.isservicepack,
        validPeriod: element.validPeriodLabel,
        childservicepkgserviceid: element.childservicepkgserviceid === null ? 0 : element.childservicepkgserviceid
      });
    });
    const initialState = {
      displayUserServicesForCheckOut: this.listOfServicesForCheckOut,
      userservicedetailsList: this.userservicedetailsAddedList
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
