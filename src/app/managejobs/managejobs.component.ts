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
  searchbyfiltername: string;
  name: string;
  code: string;
  startdate: Date;
  enddate: Date;
  startDate = new Date();
  endDate = new Date();
  iscreatejob = false;
  diffMs: any;
  actDate: any;
  purchaseDate: any;
  maxHours = 0;
  constructor(
    private route: ActivatedRoute,
    private alertService: AlertsService,
    public userService: UserService,
    private router: Router,
  ) {
    route.params.subscribe(params => {
      this.code = params.code;
      this.name = params.name;
      this.searchbyfiltername = params.filtername;
    });
  }

  ngOnInit() {
    var minStartDate = new Date();
    minStartDate.setDate(minStartDate.getDate() + 1);
    var dd = minStartDate.getDate();
    var mm = minStartDate.getMonth() + 1;
    var y = minStartDate.getFullYear();
    var startDtFmt = mm + '/' + dd + '/' + y + ' 10:00:00';
    this.startDate = new Date(startDtFmt);

    var maxStartDate = new Date();
    maxStartDate.setDate(maxStartDate.getDate() + 2);
    var dd = maxStartDate.getDate();
    var mm = maxStartDate.getMonth() + 1;
    var y = maxStartDate.getFullYear();
    var endDtFmt = mm + '/' + dd + '/' + y + ' 10:00:00';
    this.endDate = new Date(endDtFmt);

    if (this.searchbyfiltername === config.search_byfilter_fu) {
      this.iscreatejob = true;
    }
  }

  test() {
  }

  backToSearch() {
    this.router.navigateByUrl('fusearch/', { skipLocationChange: true }).
      then(() => {
        this.router.navigate(['dashboard/' + this.code + '/' + this.name + '/' + this.searchbyfiltername]);
      });
  }
  onChangeEndDateCalcHours() {
    console.log('this is start dat formatted', this.startdate);
    console.log('this is end date', this.enddate);

    if (this.startdate != null && this.enddate != null) {
      if (new Date(this.getDateFormat(this.startdate)) >= new Date(this.getDateFormat(this.enddate))) {
        this.alertService.error('Start Date can not equal same datetime or greater than the End Date');
        this.maxHours = null;
        this.startdate = null;
      } else {
        this.maxHours = this.getHrBetweenDate(this.startdate, this.enddate);
        console.log('this is max Hourst', this.maxHours);
      }
    } else {
      this.maxHours = null;
    }
  }

  private getHrBetweenDate(stDate: Date, eDate: Date) {
    this.actDate = new Date(this.startdate);
    this.purchaseDate = new Date(this.enddate)
    this.diffMs = (this.purchaseDate - this.actDate); // milliseconds
    let diffDays = Math.floor(this.diffMs / 86400000); // days
    let diffHrs = Math.floor((this.diffMs % 86400000) / 3600000); // hours
    let diffMins = Math.round(((this.diffMs % 86400000) % 3600000) / 60000); // minutes
    //console.log(diffDays + ' days, ' + diffHrs + ' hours, ' + diffMins + 'minutes');
    if (diffDays > 0) {
      return diffDays * 24;
    } else {
      return diffHrs;
    }
  }

  getDateFormat(dt: Date) {
    var date = new Date(dt);
    var year = date.getFullYear();
    var tempmonth = date.getMonth() + 1; //getMonth is zero based;
    var tempday = date.getDate();
    var hr = date.getHours();
    var tempmin = date.getMinutes();

    var month = tempmonth > 10 ? tempmonth : '0' + tempmonth;
    var day = tempday > 10 ? tempday : '0' + tempday;
    var min = tempmin > 10 ? tempmin : '0' + tempmin;

    var formatted = year + '-' + month + '-' + day + ' ' + hr + ':' + min;
    return formatted;
  }

}
