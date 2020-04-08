import { ActivatedRoute } from '@angular/router';
import { NewServiceAdapter } from './../adapters/newserviceadapter';
import { NewsvcService } from './../AppRestCall/newsvc/newsvc.service';
import { NewService } from './../appmodels/NewService';
import { Component, OnInit } from '@angular/core';
import { DashboardofcbaComponent } from '../dashboardofcba/dashboardofcba.component';
import { ManageserviceComponent } from '../manageservice/manageservice.component';
import { config } from 'src/app/appconstants/config';


@Component({
  selector: 'app-homeprice',
  templateUrl: './homeprice.component.html',
  styleUrls: ['./homeprice.component.css']
})
export class HomepriceComponent implements OnInit {

  name: string;
  langcode: string;

  constructor(
    private newsvcservice: NewsvcService,
    private route: ActivatedRoute,
    private newsvcadapter: NewServiceAdapter,
    public dashboardofcbaobj: DashboardofcbaComponent,
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
  }

  preparesignup(servierid: string) {

  }

}
