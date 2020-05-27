import { AlertsService } from './../AppRestCall/alerts/alerts.service';
import { FreelanceserviceService } from './../AppRestCall/freelanceservice/freelanceservice.service';
import { Component, OnInit } from '@angular/core';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-hometestimonials',
  templateUrl: './hometestimonials.component.html',
  styleUrls: ['./hometestimonials.component.css']
})
export class HometestimonialsComponent implements OnInit {

  listofTestimonals: any;

  constructor(
    public freelanceserviceService: FreelanceserviceService,
    private alertService: AlertsService,
    private spinnerService: Ng4LoadingSpinnerService,

  ) { }

  ngOnInit() {
    this.getFUFeebackDetails();
  }
  getFUFeebackDetails() {
    this.spinnerService.show();
    this.listofTestimonals = [];
    this.freelanceserviceService.getFUFeebackDetails().subscribe((list: any) => {
      list.forEach(element => {
        console.log('element', element);
        element.starrate = Array(element.starrate);
        this.listofTestimonals.push(element);
      });
      console.log('this.listofTestimonals', this.listofTestimonals);
    },
      error => {
        this.spinnerService.hide();
        this.alertService.error(error);
      });
  }
}
