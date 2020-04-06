import { NewServiceAdapter } from './../adapters/newserviceadapter';
import { NewsvcService } from './../AppRestCall/newsvc/newsvc.service';
import { NewService } from './../appmodels/NewService';
import { Component, OnInit } from '@angular/core';
import { DashboardofcbaComponent } from '../dashboardofcba/dashboardofcba.component';
import { ManageuserserviceComponent } from '../manageuserservice/manageuserservice.component';
import { ManageserviceComponent } from '../manageservice/manageservice.component';


@Component({
  selector: 'app-homeprice',
  templateUrl: './homeprice.component.html',
  styleUrls: ['./homeprice.component.css']
})
export class HomepriceComponent implements OnInit {

  
  constructor(
    private newsvcservice: NewsvcService,
    private newsvcadapter: NewServiceAdapter,
    public  dashboardofcbaobj:DashboardofcbaComponent,
    public manageserviceComponent: ManageserviceComponent, ) { }

  ngOnInit() {
    this.dashboardofcbaobj.getListOfAllActivePlatformServices();
    this.manageserviceComponent.getServiceTerms();
}

  preparesignup(servierid: string) {

  }

}
