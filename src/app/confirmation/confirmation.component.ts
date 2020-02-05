import { Component, OnInit } from '@angular/core';
import { UserService } from '../AppRestCall/user/user.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { first } from 'rxjs/operators';
import { User } from 'src/app/appmodels/User';
import { UserAdapter } from '../adapters/useradapter';
import { AlertsService } from '../AppRestCall/alerts/alerts.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Router } from '@angular/router';

@Component({
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent implements OnInit {

  id: number;
  usrObj: User;
  isalert = true;

  constructor(
    private userService: UserService,
    public  modalRef: BsModalRef,
    private userAdapter: UserAdapter,
    private alertService: AlertsService,
    private spinnerService: Ng4LoadingSpinnerService,
    private router: Router,
  ) {
    }

  ngOnInit() {
    console.log('ConfirmationComponent' , this.id);
    if (this.id != null) {
      this.spinnerService.show();
      this.userService.getUserByUserId(this.id).pipe(first()).subscribe(
        (resp) => {
          this.usrObj = this.userAdapter.adapt(resp);
          if ( this.usrObj.userId > 0 ) {
            this.userService.saveorupdate(this.usrObj).pipe(first()).subscribe(
              (userObj) => {
                this.isalert = false;
                this.router.navigate(['/']);
                this.spinnerService.hide();
              },
              error => {
                this.isalert = true;
                this.alertService.error(error);
                this.spinnerService.hide();
              });
          }
        },
        error => {
          this.isalert = true;
          this.alertService.error(error);
          this.spinnerService.hide();
        });
    }
  }

}
