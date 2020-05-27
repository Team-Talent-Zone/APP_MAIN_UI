import { ReferenceService } from './../AppRestCall/reference/reference.service';
import { ActivatedRoute } from '@angular/router';
import { AlertsService } from './../AppRestCall/alerts/alerts.service';
import { FreelanceserviceService } from './../AppRestCall/freelanceservice/freelanceservice.service';
import { Component, OnInit } from '@angular/core';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { config } from 'src/app/appconstants/config';
import { Observable } from 'rxjs';

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
          this.referService.translatetext(element.feedbackcomment, langcode).subscribe(
            (txt: string) => {
              element.feedbackcomment = txt;
            }
          );
          this.referService.translatetext(element.fullname, langcode).subscribe(
            (txt: string) => {
              element.fullname = txt;
            }
          );
          this.referService.translatetext(element.feedbackby, langcode).subscribe(
            (txt: string) => {
              element.feedbackby = txt;
            }
          );
          this.referService.translatetext(element.label, langcode).subscribe(
            (txt: string) => {
              element.label = txt;
            }
          );
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


}
