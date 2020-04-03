import { ReferenceService } from './../AppRestCall/reference/reference.service';
import { ReferenceAdapter } from './../adapters/referenceadapter';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { UserService } from './../AppRestCall/user/user.service';
import { NewServiceAdapter } from './../adapters/newserviceadapter';
import { NewsvcService } from './../AppRestCall/newsvc/newsvc.service';
import { Component, OnInit } from '@angular/core';
import { SignupComponent } from './../signup/signup.component';
import { config } from 'src/app/appconstants/config';
import { map, first } from 'rxjs/operators';

@Component({
  selector: 'app-manageservice',
  templateUrl: './manageservice.component.html',
  styleUrls: ['./manageservice.component.css']
})
export class ManageserviceComponent implements OnInit {

  listOfAllNewServices: any = [];
  myNewServiceForReview: any = [];
  serviceterms: any;

  constructor(
    public newsvcservice: NewsvcService,
    private newserviceAdapter: NewServiceAdapter,
    private userService: UserService,
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
}
