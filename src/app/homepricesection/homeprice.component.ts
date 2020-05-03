import { ActivatedRoute } from '@angular/router';
import { NewServiceAdapter } from './../adapters/newserviceadapter';
import { NewsvcService } from './../AppRestCall/newsvc/newsvc.service';
import { NewService } from './../appmodels/NewService';
import { Component, OnInit } from '@angular/core';
import { DashboardofcbaComponent } from '../dashboardofcba/dashboardofcba.component';
import { ManageserviceComponent } from '../manageservice/manageservice.component';
import { config } from 'src/app/appconstants/config';
import { SignupComponent } from '../signup/signup.component';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';


@Component({
  selector: 'app-homeprice',
  templateUrl: './homeprice.component.html',
  styleUrls: ['./homeprice.component.css']
})
export class HomepriceComponent implements OnInit {
  modalRef: BsModalRef;

  name: string;
  langcode: string;
  listofAllIndividualServices: any = [];
  listofAllPackageServices: any = [];

  constructor(
    private newsvcservice: NewsvcService,
    private route: ActivatedRoute,
    private newsvcadapter: NewServiceAdapter,
    public dashboardofcbaobj: DashboardofcbaComponent,
    private modalService: BsModalService,
    public manageserviceComponent: ManageserviceComponent,
  ) {
    route.params.subscribe(params => {
      this.name = params.name;
    });
  }

  ngOnInit() {
    this.langcode = null;
    if (this.name === config.lang_english_word.toString()) {
      this.langcode = config.default_prefer_lang;
    } else
      if (this.name === config.lang_hindi_word.toString()) {
        this.langcode = config.lang_code_hi;
      } else
        if (this.name === config.lang_telugu_word.toString()) {
          this.langcode = config.lang_code_te;
        } else {
          this.langcode = config.default_prefer_lang;
        }
    this.dashboardofcbaobj.getListOfAllActivePlatformServices(this.langcode);
    this.manageserviceComponent.getServiceTerms();
    setTimeout(() => {
      this.divideByIndOrPackageService();
    }, 1000);
  }

  divideByIndOrPackageService() {
    this.listofAllIndividualServices = [];
    this.listofAllPackageServices = [];
    this.dashboardofcbaobj.listOfAllApprovedNewServices.forEach(element => {
      console.log('element.packwithotherourserviceid', element.packwithotherourserviceid);
      if (element.packwithotherourserviceid === null) {
        this.listofAllIndividualServices.push(element);
      } else {
        this.listofAllPackageServices.push(element);
      }
    });
    console.log('listofAllIndividualServices', this.listofAllIndividualServices);
  }
  openSignupModal(ourserviceid: number, packwithotherourserviceid: number) {
    var ourserviceidList = [{ ourserviceid, packwithotherourserviceid }];
    this.modalRef = this.modalService.show(SignupComponent, {
      initialState: {
        key: config.shortkey_role_cba,
        ourserviceids: ourserviceidList,
      }
    });
  }

}
