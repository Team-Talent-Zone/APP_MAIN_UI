import { Component, OnInit , OnDestroy} from '@angular/core';
import { Subscription } from 'rxjs';
import { AlertsService } from '../AppRestCall/alerts/alerts.service';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {

  private subscription: Subscription;
  message: any;

  constructor(
    private alertService: AlertsService,
    public  modalRef: BsModalRef,
    ) { }

  ngOnInit() {
    console.log('Inside AlertComponent');
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
      });
  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngOnDestroy() {
      this.subscription.unsubscribe();
  }

}
