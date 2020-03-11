import { Component, OnInit } from '@angular/core';
import { UserService } from '../AppRestCall/user/user.service';
import { Router } from '@angular/router';
import { User } from '../appmodels/User';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  usrObj: User;
  constructor(
    private userService: UserService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.usrObj = this.userService.currentUserValue;
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['/app']);
  }
}
