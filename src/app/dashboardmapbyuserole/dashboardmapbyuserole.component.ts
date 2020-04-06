import { UserService } from '../AppRestCall/user/user.service';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-dashboardmapbyuserole',
  templateUrl: './dashboardmapbyuserole.component.html',
  styleUrls: ['./dashboardmapbyuserole.component.css']
})
export class DashboardmapbyuseroleComponent implements OnInit {



  constructor(
    public userService: UserService
  ) { }

  ngOnInit() {
}
}
