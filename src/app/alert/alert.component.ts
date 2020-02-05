import { Component, TemplateRef, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AlertsService } from '../AppRestCall/alerts/alerts.service';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {

  public  modalRef: BsModalRef;
  @ViewChild('template', null) modalTemplate: TemplateRef<any>;

  private subscription: Subscription;
  message: any;
  config: ModalOptions = { class: 'modal-sm' };

  constructor(
    private alertService: AlertsService,
    private modalService: BsModalService,
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
          }
          this.message = message;
          console.log('this is alert componet message' , this.message);
          if (this.message != null) {
            this.openModal(this.modalTemplate);
          }
        });
    }

    openModal(template: TemplateRef<any>) {
      this.modalRef = this.modalService.show(template, this.config);
    }

    // tslint:disable-next-line: use-lifecycle-interface
    ngOnDestroy() {
      this.subscription.unsubscribe();
  }

}
