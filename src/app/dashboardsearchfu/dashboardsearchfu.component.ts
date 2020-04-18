import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboardsearchfu',
  templateUrl: './dashboardsearchfu.component.html',
  styleUrls: ['./dashboardsearchfu.component.css']
})
export class DashboardsearchfuComponent implements OnInit {

  name: string;

  constructor(
    private route: ActivatedRoute,
  ) {
    route.params.subscribe(params => {
      this.name = params.name;
    });
  }

  ngOnInit() {
 console.log(' search item' , this.name);
  }
}
