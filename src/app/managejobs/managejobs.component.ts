import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-managejobs',
  templateUrl: './managejobs.component.html',
  styleUrls: ['./managejobs.component.css']
})
export class ManagejobsComponent implements OnInit {
  id: number;
  iscreatejob = false;
  constructor(private route: ActivatedRoute,
  ) {
    route.params.subscribe(params => {
      this.id = params.id;
    });
  }

  ngOnInit() {

    if (this.id == 0) {
      this.iscreatejob = true;
    }
  }

}
