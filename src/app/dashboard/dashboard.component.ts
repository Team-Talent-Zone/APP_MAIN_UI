import { Component, OnInit } from '@angular/core';
import { UserService } from '../AppRestCall/user/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(
    private userService: UserService,
    private router: Router,
  ) { }

  ngOnInit() {
    if (this.userService.currentUserValue) {
      console.log('Current User Object' , this.userService.currentUserValue);
      }
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['/']);
  }
}
