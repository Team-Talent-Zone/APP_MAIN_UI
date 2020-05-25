import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { config } from 'src/app/appconstants/config';
import { AlertsService } from '../AppRestCall/alerts/alerts.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-createoreditwidget',
  templateUrl: './createoreditwidget.component.html',
  styleUrls: ['./createoreditwidget.component.css']
})
export class CreateoreditwidgetComponent implements OnInit {

  id: number;

  constructor(
    private spinnerService: Ng4LoadingSpinnerService,
    private alertService: AlertsService,
    private cd: ChangeDetectorRef,
    route: ActivatedRoute,

  ) {
    route.params.subscribe(params => {
      this.id = params.id;
    });
  }

  filename: string;
  logoId: any;
  companyimgurlId: any;
  companybgurlId: any;
  companyfburlId: any;
  companyInstaurlId: any;

  ngOnInit() {
    if (this.id > 0) {
      this.openWidgetDetailsBYWidgetId();
    }
  }

  openWidgetDetailsBYWidgetId() {

  }

  uploadFile(event: any, type: string) {
    this.spinnerService.show();
    let reader = new FileReader(); // HTML5 FileReader API
    let file = event.target.files[0];
    if (file.type === config.imgtype_png.toString() ||
      file.type === config.imgtype_jpeg.toString() ||
      file.type === config.imgtype_jpg.toString()) {
      if (event.target.files && event.target.files[0]) {
        reader.readAsDataURL(file);
        // When file uploads set it to file formcontrol
        reader.onload = () => {
          this.filename = file.name;
          if (type === config.widget_logo.toString()) {
            this.logoId = reader.result;
          }
          if (type === config.widget_companyimgurl.toString()) {
            this.companyimgurlId = reader.result;
          }
          if (type === config.widget_companybgurlId.toString()) {
            this.companybgurlId = reader.result;
          }
          this.spinnerService.hide();
        };
        // ChangeDetectorRef since file is loading outside the zone
        this.cd.markForCheck();
      }
    } else {
      this.alertService.error('Invalid file format. it should be .png,.jpg,.jpeg');
    }
  }
}
