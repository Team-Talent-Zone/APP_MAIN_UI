import { ReferenceService } from './../AppRestCall/reference/reference.service';
import { ActivatedRoute } from '@angular/router';
import { AlertsService } from './../AppRestCall/alerts/alerts.service';
import { FreelanceserviceService } from './../AppRestCall/freelanceservice/freelanceservice.service';
import { Component, OnInit } from '@angular/core';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { config } from 'src/app/appconstants/config';

@Component({
  selector: 'app-hometestimonials',
  templateUrl: './hometestimonials.component.html',
  styleUrls: ['./hometestimonials.component.css']
})
export class HometestimonialsComponent implements OnInit {

  listofTestimonals: any;
  name: string;

  constructor(
    public freelanceserviceService: FreelanceserviceService,
    private alertService: AlertsService,
    private spinnerService: Ng4LoadingSpinnerService,
    private route: ActivatedRoute,
    private referService: ReferenceService,
  ) {
    route.params.subscribe(params => {
      this.name = params.name;
    });
  }

  ngOnInit() {
    console.log('this name', this.name);
    if (this.name === config.lang_hindi_word.toString()) {
      this.getFUFeebackDetails(config.lang_code_hi);

    } else
      if (this.name === config.lang_telugu_word.toString()) {
        this.getFUFeebackDetails(config.lang_code_te);

      } else {
        this.getFUFeebackDetails(config.default_prefer_lang);
      }
  }
  getFUFeebackDetails(langcode: string) {
    this.spinnerService.show();
    this.listofTestimonals = [];
    this.freelanceserviceService.getFUFeebackDetails().subscribe((list: any) => {
      list.forEach((element: any) => {
        element.starrate = Array(element.starrate);
        if (langcode === config.lang_code_te || langcode === config.lang_code_hi) {
          element.feedbackcomment = this.translateText(element.feedbackcomment, langcode);
          element.label = this.translateText(element.label, langcode);
          element.feedbackby = this.translateText(element.feedbackby, langcode);
          element.fullname = this.translateText(element.fullname, langcode);
          this.listofTestimonals.push(element);
        } else {
          this.listofTestimonals.push(element);
        }
      });
    },
      error => {
        this.spinnerService.hide();
        this.alertService.error(error);
      });
  }

  translateText(targetTxt: string, preferlang: string) {
    this.referService.translatetext(targetTxt, preferlang).subscribe(
      (trantxt: any) => {
        return trantxt.translateresp;
      },
      error => {
        this.spinnerService.hide();
        this.alertService.error(error);
      }
    );
  }
}
