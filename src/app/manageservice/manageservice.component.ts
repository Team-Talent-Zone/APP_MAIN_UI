import { UserService } from './../AppRestCall/user/user.service';
import { NewServiceAdapter } from './../adapters/newserviceadapter';
import { NewsvcService } from './../AppRestCall/newsvc/newsvc.service';
import { Component, OnInit } from '@angular/core';
import { NewService } from '../appmodels/NewService';

@Component({
  selector: 'app-manageservice',
  templateUrl: './manageservice.component.html',
  styleUrls: ['./manageservice.component.css']
})
export class ManageserviceComponent implements OnInit {

  listOfAllNewServices: any = [];
  myNewServiceForReview: any = [];

  constructor(
    public newsvcservice: NewsvcService,
    private newserviceAdapter: NewServiceAdapter,
    private userService: UserService,
  ) { }

  ngOnInit() {
    this.getAllNewServiceDetails();
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
  console.log('this.myNewServiceForReview' ,this.myNewServiceForReview);
  }
}
