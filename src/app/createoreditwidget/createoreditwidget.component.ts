import { WidgetLayout } from './../appmodels/WidgetLayout';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { config } from 'src/app/appconstants/config';
import { AlertsService } from '../AppRestCall/alerts/alerts.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilService } from '../AppRestCall/util/util.service';
import { UserService } from '../AppRestCall/user/user.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { WidgetForService } from '../appmodels/WidgetForService';
import { WidgetService } from '../AppRestCall/widget/widget.service';
import { UsersrvdetailsService } from '../AppRestCall/userservice/usersrvdetails.service';

@Component({
  selector: 'app-createoreditwidget',
  templateUrl: './createoreditwidget.component.html',
  styleUrls: ['./createoreditwidget.component.css']
})
export class CreateoreditwidgetComponent implements OnInit {

  id: number;
  widgetlayout: any;
  widigetsvc: any;
  widgetcurrentobj: any;

  constructor(
    private spinnerService: Ng4LoadingSpinnerService,
    private alertService: AlertsService,
    private cd: ChangeDetectorRef,
    route: ActivatedRoute,
    private utilService: UtilService,
    public userService: UserService,
    private formBuilder: FormBuilder,
    private widgetService: WidgetService,
    private usersrvDetails: UsersrvdetailsService,
    private router: Router,
  ) {
    route.params.subscribe(params => {
      this.id = params.id;
    });
  }

  filenamelogo: string;
  filenameimgurl: string;
  filenamebgurl: string;

  companylogoId: any;
  companyimgurlId: any;
  companybgurlId: any;
  companyfburlId: any;
  companyInstaurlId: any;
  issubmit = false;
  createoreditFormGroup: FormGroup;
  listofusersrv: any;
  logoflag = false;
  bgflag = false;
  companyimgflag = false;
  widgetId: number;

  ngOnInit() {
    this.createwidgetform();
    if (this.id > 0) {
      this.openWidgetDetailsBYWidgetId();
    }
  }

  openWidgetDetailsBYWidgetId() {
    this.spinnerService.show();
    this.listofusersrv = [];
    this.usersrvDetails.getAllUserServiceDetailsByUserId(this.userService.currentUserValue.userId).subscribe(
      (listofusersrvDetails: any) => {
        this.listofusersrv = listofusersrvDetails;
        listofusersrvDetails.forEach(element => {
          // tslint:disable-next-line: triple-equals
          if (element.ourserviceId == this.id && element.widgetId > 0) {
            this.widgetService.getAllWidgetDetailsyWidgetId(element.widgetId).subscribe((widgetibj: WidgetForService) => {
              this.widgetcurrentobj = widgetibj;
              this.createoreditFormGroup.patchValue({ companyname: widgetibj.widgetLayoutEntity.companyname });
              this.createoreditFormGroup.patchValue({ footercompanyaddress: widgetibj.widgetLayoutEntity.footercompanyaddress });
              this.createoreditFormGroup.patchValue({ footercontent: widgetibj.widgetLayoutEntity.footercontent });
              this.createoreditFormGroup.patchValue({ footerfburl: widgetibj.widgetLayoutEntity.footerfburl });
              this.companylogoId = widgetibj.widgetLayoutEntity.logourl;
              this.companyimgurlId = widgetibj.widgetLayoutEntity.companyimgurl;
              this.companybgurlId = widgetibj.widgetLayoutEntity.bgimgurl;
              this.companyfburlId = widgetibj.widgetLayoutEntity.footerfburl;
              this.companyInstaurlId = widgetibj.widgetLayoutEntity.footerinstaurl;
              this.spinnerService.hide();
            },
              error => {
                this.alertService.error(error);
                this.spinnerService.hide();
              });
          }
        });
      },
      error => {
        this.alertService.error(error);
        this.spinnerService.hide();
      });
  }

  createwidgetform() {
    this.createoreditFormGroup = this.formBuilder.group({
      companyname: ['', [Validators.required]],
      footercompanyaddress: ['', [Validators.required]],
      footercontent: [''],
      footerfburl: [''],
      footerinstaurl: ['']

    });
  }

  get f() {
    return this.createoreditFormGroup.controls;
  }

  preparetosavewidgetdetails() {
    this.issubmit = true;
    if (this.createoreditFormGroup.invalid) {
      return;
    }
    if (this.widgetcurrentobj == null) {
      this.widgetlayout = new WidgetLayout();
    } else {
      this.widgetlayout = this.widgetcurrentobj.widgetLayoutEntity;
    }

    if (this.filenamelogo != null) {
      this.uploadWidgetPicsInS3(config.widget_logo.toString(), this.companylogoId, this.filenamelogo);
    } else {
      this.logoflag = true;
    }
    if (this.filenameimgurl != null) {
      this.uploadWidgetPicsInS3(config.widget_companyimgurl.toString(), this.companyimgurlId, this.filenameimgurl);
    } else {
      this.companyimgflag = true;
    }
    if (this.filenamebgurl != null) {
      this.uploadWidgetPicsInS3(config.widget_companybgurlId.toString(), this.companybgurlId, this.filenamebgurl);
    } else {
      this.bgflag = true;
    }
    this.widgetlayout.footercontent = this.createoreditFormGroup.get('footercontent').value;
    this.widgetlayout.footercompanyaddress = this.createoreditFormGroup.get('footercompanyaddress').value;
    this.widgetlayout.companyname = this.createoreditFormGroup.get('companyname').value;
    this.widgetlayout.footerfburl = this.createoreditFormGroup.get('footerfburl').value;
    this.widgetlayout.footerinstaurl = this.createoreditFormGroup.get('footerinstaurl').value;
    if (this.widgetcurrentobj == null) {
      this.widigetsvc = new WidgetForService();
    } else {
      this.widigetsvc = this.widgetcurrentobj;
    }
    this.listofusersrv.forEach(element => {
      if (element.ourserviceId == this.id) {
        this.widgetId = element.widgetId;
        this.widigetsvc.isActive = element.isservicepurchased;
        if (element.isservicepurchased) {
          this.widigetsvc.ispublished = true;
        }
        this.widigetsvc.status = element.status;
        this.widigetsvc.hostname = element.publishedlinkurl;
        this.widigetsvc.serviceId = element.serviceId;
      }
    });
    this.widigetsvc.widgetLayoutEntity = this.widgetlayout;
    this.widigetsvc.userId = this.userService.currentUserValue.userId;
    console.log(this.logoflag);
    console.log(this.companyimgflag);
    console.log(this.bgflag);
    this.spinnerService.show();
    setTimeout(() => {
      if (this.logoflag && this.companyimgflag && this.bgflag && this.widgetId == null) {
        console.log(this.logoflag);
        console.log(this.companyimgflag);
        console.log(this.bgflag);
        this.widgetService.saveWidgetService(this.widigetsvc).subscribe((obj: WidgetForService) => {
          if (obj.widgetId > 0) {
            this.alertService.success('Customized Widget is saved');
            this.spinnerService.hide();
          }
        },
          error => {
            this.alertService.error(error);
            this.spinnerService.hide();
          });
      } else {
        this.widgetService.saveOrUpdateWidget(this.widigetsvc).subscribe((obj: WidgetForService) => {
          if (obj.widgetId > 0) {
            this.alertService.success('Customized Widget is changes saved');
            this.spinnerService.hide();
          }
        },
          error => {
            this.alertService.error(error);
            this.spinnerService.hide();
          });
      }
    }, 9000);
  }

  private uploadWidgetPicsInS3(type: string, imageId: string, filename: string) {
    setTimeout(() => {
      if (filename != null) {
        this.utilService.uploadWidgetPicsInS3(imageId, this.userService.currentUserValue.userId, filename).subscribe(
          (returnURL: string) => {
            if (type === config.widget_logo.toString()) {
              this.logoflag = true;
              this.widgetlayout.logourl = returnURL;
              this.filenamelogo = null;
            }
            if (type === config.widget_companyimgurl.toString()) {
              this.companyimgflag = true;
              this.widgetlayout.companyimgurl = returnURL;
              this.filenameimgurl = null;
            }
            if (type === config.widget_companybgurlId.toString()) {
              this.bgflag = true;
              this.widgetlayout.bgimgurl = returnURL;
              this.filenamebgurl = null;
            }
          },
          error => {
            this.alertService.error(error);
            this.spinnerService.hide();
          });
      }
    }, 6000);

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
          if (type === config.widget_logo.toString()) {
            this.companylogoId = reader.result;
            this.filenamelogo = file.name;

          }
          if (type === config.widget_companyimgurl.toString()) {
            this.companyimgurlId = reader.result;
            this.filenameimgurl = file.name;

          }
          if (type === config.widget_companybgurlId.toString()) {
            this.companybgurlId = reader.result;
            this.filenamebgurl = file.name;

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
