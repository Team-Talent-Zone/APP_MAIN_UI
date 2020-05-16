import { AlertsService } from './../AppRestCall/alerts/alerts.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../AppRestCall/user/user.service';
import { config } from '../appconstants/config';

@Component({
  selector: 'app-managejobs',
  templateUrl: './managejobs.component.html',
  styleUrls: ['./managejobs.component.css']
})

export class ManagejobsComponent implements OnInit {


  constructor(
    private route: ActivatedRoute,
    private alertService: AlertsService,
    public userService: UserService,
    private router: Router,
  ) {
  }

  ngOnInit() {
  }

}
