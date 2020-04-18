import { AlertsService } from './../AppRestCall/alerts/alerts.service';
import { NewServiceHistory } from './../appmodels/NewServiceHistory';
import { ViewnewsevicedetailsComponent } from './../viewnewsevicedetails/viewnewsevicedetails.component';
import { ProcessnewserviceComponent } from './../processnewservice/processnewservice.component';
import { ReferenceService } from './../AppRestCall/reference/reference.service';
import { ReferenceAdapter } from './../adapters/referenceadapter';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { UserService } from './../AppRestCall/user/user.service';
import { NewServiceAdapter } from './../adapters/newserviceadapter';
import { NewsvcService } from './../AppRestCall/newsvc/newsvc.service';
import { Component, OnInit } from '@angular/core';
import { SignupComponent } from './../signup/signup.component';
import { config } from 'src/app/appconstants/config';
import { map } from 'rxjs/operators';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { NewService } from '../appmodels/NewService';

@Component({
  selector: 'app-manageservice',
  templateUrl: './manageservice.component.html',
  styleUrls: ['./manageservice.component.css']
})
export class ManageserviceComponent implements OnInit {

  listOfAllNewServices: any = [];
  listOfAllApprovedNewServices = [];
  listOfAllRejectedNewServices: any = [];
  listOfAllPendingNewServices: any = [];

  myNewServiceForReview: any = [];
  myNewServiceForReviewAllCommentHistory: any = [];
  serviceterms: any;
  modalRef: BsModalRef;
  config: ModalOptions = { class: 'modal-lg' };
  historyarray: any = [];
  constructor(
    private modalService: BsModalService,
    public newsvcservice: NewsvcService,
    private alertService: AlertsService,
    private newserviceAdapter: NewServiceAdapter,
    public userService: UserService,
    public signupComponent: SignupComponent,
    private spinnerService: Ng4LoadingSpinnerService,
    private refAdapter: ReferenceAdapter,
    private referService: ReferenceService,
  ) {
    this.signupComponent.reflookupdetails = [];
    this.signupComponent.referencedetailsmap = [];
  }

  ngOnInit() {
    this.getAllNewServiceDetails();
    this.signupComponent.getAllCategories(config.default_prefer_lang.toString());
    this.getServiceTerms();
  }

  getServiceTerms() {
    this.spinnerService.show();
    this.referService.getReferenceLookupByKey(config.key_service_term.toString()).
      pipe(map((data: any[]) => data.map(item => this.refAdapter.adapt(item))),
      ).subscribe(
        data => {
          this.serviceterms = data;
        });
    this.spinnerService.hide();
  }

  getAllNewServiceDetails() {
    this.spinnerService.show();
    this.newsvcservice.getAllNewServiceDetails().subscribe(
      (allNewServiceObjs: NewService[]) => {
        for (const element of allNewServiceObjs) {
          this.myNewServiceForReviewAllCommentHistory.push(this.newserviceAdapter.adapt(element));
          if (element.serviceHistory != null) {
            element.serviceHistory.forEach((elementHis: any) => {
              if (element.currentstatus === elementHis.status) {
                element.serviceHistory = [];
                element.serviceHistory.push(elementHis);
                this.listOfAllNewServices.push(this.newserviceAdapter.adapt(element));
              }

              if (elementHis.decisionbyemailid === this.userService.currentUserValue.username &&
                elementHis.islocked && element.currentstatus === elementHis.status) {
                element.serviceHistory = [];
                element.serviceHistory.push(elementHis);
                this.myNewServiceForReview.push(this.newserviceAdapter.adapt(element));
              }
              if (element.currentstatus === elementHis.status &&
                (element.currentstatus === config.newservice_code_senttocssm ||
                  element.currentstatus === config.newservice_code_senttocsst)) {
                element.serviceHistory = [];
                element.serviceHistory.push(elementHis);
                this.listOfAllPendingNewServices.push(this.newserviceAdapter.adapt(element));
              }

              if (element.currentstatus === elementHis.status && element.currentstatus === config.newservice_code_approved.toString()) {
                element.serviceHistory = [];
                element.serviceHistory.push(elementHis);
                this.listOfAllApprovedNewServices.push(this.newserviceAdapter.adapt(element));
              }

              if (element.currentstatus === elementHis.status && element.currentstatus === config.newservice_code_rejected.toString()) {
                element.serviceHistory = [];
                element.serviceHistory.push(elementHis);
                this.listOfAllRejectedNewServices.push(this.newserviceAdapter.adapt(element));
              }
            });
          }
        }
        this.spinnerService.hide();
      },
      error => {
        this.spinnerService.hide();
        this.alertService.error(error);
      });
  }

  viewnewservicedetails(ourserviceId: number) {
    this.listOfAllNewServices.forEach((element: any) => {
      if (element.ourserviceId === ourserviceId) {
        const initialState = { newserviceobj: element };
        this.modalRef = this.modalService.show(ViewnewsevicedetailsComponent, Object.assign(
          {},
          this.config,
          {
            initialState
          }
        )
        );
      }
    });
  }

  processnewserviceopenmodal(ourserviceId: number) {
    this.historyarray = [];
    this.spinnerService.show();
    this.myNewServiceForReviewAllCommentHistory.forEach((element: NewService) => {
      if (element.ourserviceId === ourserviceId) {
        this.historyarray.push(element);
      }
    });
    if (this.historyarray.length > 0) {
      this.myNewServiceForReview.forEach((elementObj: NewService) => {
        if (elementObj.ourserviceId === ourserviceId) {
          const initialState = {
            newserviceobj: elementObj,
            newservicedetailswithallCommentHistory: this.historyarray
          };
          this.modalRef = this.modalService.show(ProcessnewserviceComponent, Object.assign(
            {},
            this.config,
            {
              initialState
            }
          )
          );
        }
      });
      this.spinnerService.hide();
    }
  }
}
