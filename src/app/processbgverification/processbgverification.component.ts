import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { User } from '../appmodels/User';
import { UserService } from '../AppRestCall/user/user.service';

@Component({
  selector: 'app-processbgverification',
  templateUrl: './processbgverification.component.html',
  styleUrls: ['./processbgverification.component.css']
})
export class ProcessbgverificationComponent implements OnInit {

  usrObjMyWork: User;
  constructor(
    public  modalRef: BsModalRef,
    public userService: UserService,

  ) { }

  ngOnInit() {
  }

}
