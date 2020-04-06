import { NewService } from './../appmodels/NewService';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-viewnewsevicedetails',
  templateUrl: './viewnewsevicedetails.component.html',
  styleUrls: ['./viewnewsevicedetails.component.css']
})
export class ViewnewsevicedetailsComponent implements OnInit {

  newserviceobj: NewService;
  constructor() { }

  ngOnInit() {
  }

}
