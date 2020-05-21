import { AlertsService } from './../AppRestCall/alerts/alerts.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../AppRestCall/user/user.service';
import { config } from '../appconstants/config';
import { FreelanceserviceService } from '../AppRestCall/freelanceservice/freelanceservice.service';

@Component({
  selector: 'app-managejobs',
  templateUrl: './managejobs.component.html',
  styleUrls: ['./managejobs.component.css']
})

export class ManagejobsComponent implements OnInit {

  newlyPostedJobs: any = [];
  completedJobs: any = [];
  upComingPostedJobs: any = []

  constructor(
    private route: ActivatedRoute,
    private alertService: AlertsService,
    public userService: UserService,
    private router: Router,
    private freelanceserviceService: FreelanceserviceService
  ) {
  }

  ngOnInit() {
    this.getUserAllJobDetailsByUserId();
  }

  getUserAllJobDetailsByUserId() {
    this.newlyPostedJobs = [];
    this.completedJobs = [];
    this.upComingPostedJobs = [];
    this.freelanceserviceService.getUserAllJobDetailsByUserId(this.userService.currentUserValue.userId).subscribe((onserviceList: any) => {
      onserviceList.forEach(element => {
        // tslint:disable-next-line: max-line-length
        if (!element.isjobcancel && !element.isjobcompleted && !element.isjobamtpaidtocompany && !element.isjobaccepted) {
          this.newlyPostedJobs.push(element);
        }
        // tslint:disable-next-line: max-line-length
        if (element.isjobactive && element.isjobaccepted) {
          this.upComingPostedJobs.push(element);
        }
        // tslint:disable-next-line: max-line-length
        if (element.isjobactive && element.isjobcompleted && element.isjobamtpaidtocompany && element.isjobaccepted) {
          this.completedJobs.push(element);
        }
      });
      console.log('newlyPostedJobs', this.newlyPostedJobs);

    });
  }
}
