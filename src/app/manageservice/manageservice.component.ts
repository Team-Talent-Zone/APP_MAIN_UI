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

@Component({
  selector: 'app-manageservice',
  templateUrl: './manageservice.component.html',
  styleUrls: ['./manageservice.component.css']
})
export class ManageserviceComponent implements OnInit {

  listOfAllNewServices: any = [];
  myNewServiceForReview: any = [];
  serviceterms: any;
  modalRef: BsModalRef;
  config: ModalOptions = { class: 'modal-lg' };

  constructor(
    private modalService: BsModalService,
    public newsvcservice: NewsvcService,
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
    this.signupComponent.getAllCategories('en');
    this.getServiceTerms();
  }

  getServiceTerms() {
    this.spinnerService.show();
    this.referService.getReferenceLookupByKey(config.key_service_term).
      pipe(map((data: any[]) => data.map(item => this.refAdapter.adapt(item))),
      ).subscribe(
        data => {
          this.serviceterms = data;
        });
  }

  getAllNewServiceDetails() {
    this.newsvcservice.getAllNewServiceDetails().subscribe(
      (allNewServiceObjs: any) => {
        allNewServiceObjs.forEach(element => {
          this.listOfAllNewServices.push(this.newserviceAdapter.adapt(element));
          if (element.serviceHistory != null) {
            element.serviceHistory.forEach(elementHis => {
              if (elementHis.decisionbyemailid === this.userService.currentUserValue.username &&
                elementHis.locked) {
                this.myNewServiceForReview.push(this.newserviceAdapter.adapt(element));
              }
            });
          }
        });
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
    this.myNewServiceForReview.forEach((element: any) => {
      if (element.ourserviceId === ourserviceId) {
        const initialState = { newserviceobj: element };
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
  }

}
