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

  newsvcobject: NewService;

  constructor(
    private newsvcservice: NewsvcService,
    private newsvcadapter: NewServiceAdapter) { }

  ngOnInit() {
  }

  getAllNewServiceDetails() {
    this.newsvcservice.getAllNewServiceDetails().subscribe((newsvcserviceRsp) => {
      this.newsvcobject = this.newsvcadapter.adapt(newsvcserviceRsp);
      console.log('this is list of new services' , this.newsvcobject);
    });
  }
}
