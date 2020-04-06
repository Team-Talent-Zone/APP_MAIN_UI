import { NewServiceAdapter } from './../adapters/newserviceadapter';
import { NewsvcService } from './../AppRestCall/newsvc/newsvc.service';
import { NewService } from './../appmodels/NewService';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-homeprice',
  templateUrl: './homeprice.component.html',
  styleUrls: ['./homeprice.component.css']
})
export class HomepriceComponent implements OnInit {

  filternewservice:any = [];
  newsvcobject: NewService;
  constructor(
    private newsvcservice: NewsvcService,
    private newsvcadapter: NewServiceAdapter) { }

  ngOnInit() {
    this.getAllNewServiceDetails();
  }

  getAllNewServiceDetails() {
    this.newsvcservice.getAllNewServiceDetails().subscribe((newsvcserviceRsp: any) => {
      newsvcserviceRsp.forEach((element: any) => {
        if(element.active)
        {
          this.filternewservice.push(this.newsvcadapter.adapt(element));
        }
        
      });
      console.log('this is list of new filternewservice.....   ' , this.filternewservice);
    });
  }

  preparesignup(servierid: string) {

  }

}
