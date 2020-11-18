import { Component, TemplateRef, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AlertsService } from '../AppRestCall/alerts/alerts.service';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {

  public modalRef: BsModalRef;
  @ViewChild('template', null) modalTemplate: TemplateRef<any>;

  private subscription: Subscription;
  message: any;
  config: ModalOptions = { class: 'modal-md' };
  errorCallCount: number = 0;
  errormsg: string;

  constructor(
    private alertService: AlertsService,
    private modalService: BsModalService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.subscription = this.alertService.getMessage()
      .subscribe(message => {
        switch (message && message.type) {
          case 'success':
            message.cssClass = 'alert alert-success';
            break;
          case 'error':
            message.cssClass = 'alert alert-danger';
            break;
          case 'info':
            message.cssClass = 'alert alert-danger';
            break;
        }
        this.message = message;
        if (this.message != null) {
          this.openModal(this.modalTemplate);
        }
      });
  }

  openModal(template: TemplateRef<any>) {
    console.log(' this alerts message status: ', this.message);

    if (this.message.type === 'error') {
      // tslint:disable-next-line: radix
      if (Number.parseInt(this.message.text.status) === 504) {
        this.router.navigate(['504error']);
      } else {
        // tslint:disable-next-line: radix
        if (Number.parseInt(this.message.text.status) === 404) {
          // tslint:disable-next-line: max-line-length
          this.router.navigate(['404error']);
        } else {
          // tslint:disable-next-line: radix
          if (Number.parseInt(this.message.text.status) !== 404 && Number.parseInt(this.message.text.status) !== 504) {
            this.errormsg = this.message.text.error.errormessage;
          }
          if (this.errorCallCount === 0 && this.errormsg != null) {
            this.modalRef = this.modalService.show(template, this.config);
            this.errorCallCount = this.errorCallCount + 1;
          } else {
            this.modalRef = this.modalService.show(template, this.config);
          }
        }
      }
    } else {
      this.errormsg = this.message.text;
      this.modalRef = this.modalService.show(template, this.config);
    }
  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
