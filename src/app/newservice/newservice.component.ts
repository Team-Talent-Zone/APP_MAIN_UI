import { Component, OnInit } from '@angular/core';
import { UserService } from '../AppRestCall/user/user.service';

@Component({
  selector: 'app-newservice',
  templateUrl: './newservice.component.html',
  styleUrls: ['./newservice.component.css']
})
export class NewserviceComponent implements OnInit {

  roleCode: string;

  constructor(
    private userService: UserService,
  ) { }

  ngOnInit() {
    this.roleCode = this.userService.currentUserValue.userroles.rolecode;
  }

}
