import { Component, OnInit } from '@angular/core';
import { NewService } from '../appmodels/NewService';

@Component({
  selector: 'app-processnewservice',
  templateUrl: './processnewservice.component.html',
  styleUrls: ['./processnewservice.component.css']
})
export class ProcessnewserviceComponent implements OnInit {

  newserviceobj: NewService;
  constructor() { }

  ngOnInit() {
    console.log('newserviceobj' , this.newserviceobj);
  }

}
