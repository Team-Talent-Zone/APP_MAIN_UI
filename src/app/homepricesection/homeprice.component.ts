import { NewServiceAdapter } from './../adapters/newserviceadapter';
import { NewsvcService } from './../AppRestCall/newsvc/newsvc.service';
import { NewService } from './../appmodels/NewService';
import { Component, OnInit } from '@angular/core';
import { DashboardofcbaComponent } from '../dashboardofcba/dashboardofcba.component';


@Component({
  selector: 'app-homeprice',
  templateUrl: './homeprice.component.html',
  styleUrls: ['./homeprice.component.css']
})
export class HomepriceComponent implements OnInit {

  
  constructor(
    private newsvcservice: NewsvcService,
    private newsvcadapter: NewServiceAdapter,
    public  dashboardofcbaobj:DashboardofcbaComponent) { }

  ngOnInit() {
    this.dashboardofcbaobj.getListOfAllActivePlatformServices();
}

  preparesignup(servierid: string) {

  }

}
