import { UtilService } from './../AppRestCall/util/util.service';
import { NewServiceAdapter } from './../adapters/newserviceadapter';
import { UserService } from './../AppRestCall/user/user.service';
import { NewServiceHistory } from './../appmodels/NewServiceHistory';
import { NewsvcService } from './../AppRestCall/newsvc/newsvc.service';
import { NewService } from './../appmodels/NewService';
import { SignupComponent } from './../signup/signup.component';
import { Component, OnInit , ChangeDetectorRef} from '@angular/core';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { AlertsService } from '../AppRestCall/alerts/alerts.service';
import { ActivatedRoute } from '@angular/router';
import { map, first } from 'rxjs/operators';
import {
  FormBuilder,
  FormGroup,
  Validators} from '@angular/forms';
import { ReferenceAdapter } from '../adapters/referenceadapter';
import { ReferenceService } from '../AppRestCall/reference/reference.service';
import { config } from 'src/app/appconstants/config';

@Component({
  selector: 'app-newservice',
  templateUrl: './newservice.component.html',
  styleUrls: ['./newservice.component.css']
})
export class NewserviceComponent implements OnInit {

  serviceImgURL: any;
  newServiceForm: FormGroup;
  id: number;
  issubmit = false;
  referencedetailsmap: any =  [];
  serviceterms: any;
  newservice: NewService;
  serviceHistory: NewServiceHistory;
  filename: string;
  constructor(
    private spinnerService: Ng4LoadingSpinnerService,
    private alertService: AlertsService,
    private cd: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private referService: ReferenceService,
    private refAdapter: ReferenceAdapter,
    public signupcomponent: SignupComponent,
    public newsvcservice: NewsvcService,
    private userService: UserService,
    private newserviceAdapter: NewServiceAdapter,
    private utilService: UtilService,
  ) {
    route.params.subscribe(params => {
      this.id = params.id;
     });
   }

  ngOnInit() {
    this.signupcomponent.getAllCategories('en');
    this.getServiceTerms();
    this.newServiceValidationForm();
    if (this.id > 0) {
      this.openExistingNewService();
    }

  }

  openExistingNewService() {

  }
  newServiceValidationForm() {
    this.newServiceForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(40)]],
      description: ['', [Validators.required]],
      fullContent: ['', [Validators.required]],
      validPeriod: ['', [Validators.required]],
      category: ['', [Validators.required]],
      domain: ['', [Validators.required]],
      price: ['', [Validators.maxLength(10),  Validators.pattern('^[0-9]*$')]],

    });
  }

  get f() {
    return this.newServiceForm.controls;
  }

  saveorsubmitNewService() {
    this.issubmit = true;
    if (this.newServiceForm.invalid) {
       return;
     }
    this.spinnerService.show();
    this.newservice = this.newserviceAdapter.adapt(this.newServiceForm);
    this.newservice.name = this.newServiceForm.get('name').value;
    this.newservice.category = this.newServiceForm.get('category').value;
    this.newservice.domain = this.newServiceForm.get('domain').value;
    this.newservice.fullContent = this.newServiceForm.get('fullContent').value;
    this.newservice.description = this.newServiceForm.get('description').value;
    this.newservice.userId = this.userService.currentUserValue.userId;
    this.newservice.validPeriod = this.newServiceForm.get('validPeriod').value;
    this.newservice.amount = this.newServiceForm.get('price').value;
    this.newservice.createdBy = this.userService.currentUserValue.fullname;
    this.newservice.updatedBy = this.userService.currentUserValue.fullname;
    this.newservice.serviceHistory = new Array<NewServiceHistory>();
    this.serviceHistory = new NewServiceHistory();
    this.serviceHistory.userId = this.userService.currentUserValue.userId;
    this.serviceHistory.managerId = this.userService.currentUserValue.usermanagerdetailsentity.managerid;
    this.serviceHistory.status = config.newservice_code_senttocssm;
    this.userService.getUserByUserId(this.serviceHistory.managerId).pipe(first()).subscribe(
      (respuser: any) => {
    this.serviceHistory.decisionBy = respuser.fullname;
    this.newservice.serviceHistory.push(this.serviceHistory);
    this.utilService.uploadAvatarsInS3( this.serviceImgURL , this.userService.currentUserValue.userId
       , this.filename).subscribe(
      (returnURL: string) => {
       this.newservice.imageUrl = returnURL;
       this.newsvcservice.saveNewService(
        this.newservice
        ).pipe(first()).subscribe(
         (newserviceObj) => {
           this.newservice = this.newserviceAdapter.adapt(newserviceObj);
           this.spinnerService.hide();
           this.alertService.success(' Sent for review to your manager ' + this.serviceHistory.decisionBy);
         },
       error => {
         this.spinnerService.hide();
         this.alertService.error(error);
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
  });
  }

  getCategoryByRefId(value: string) {
    this.referencedetailsmap = [];
    this.newServiceForm.patchValue({category: ''});
    this.signupcomponent.referencedetailsmap.forEach(element => {
      if (element.refId == value) {
        this.referencedetailsmap.push(element);
      }
    });
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

  uploadFile(event) {
    let reader = new FileReader(); // HTML5 FileReader API
    let file = event.target.files[0];
    if ( file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/jpg') {
      if (event.target.files && event.target.files[0]) {
        reader.readAsDataURL(file);
        // When file uploads set it to file formcontrol
        reader.onload = () => {
          this.filename = file.name;
          this.serviceImgURL = reader.result;
          this.spinnerService.show();
          this.spinnerService.hide();
        };
        // ChangeDetectorRef since file is loading outside the zone
        this.cd.markForCheck();
      }
    } else {
      this.alertService.error('Invalid file format. it should be .png,.jpg,.jpeg');
    }
  }

}
