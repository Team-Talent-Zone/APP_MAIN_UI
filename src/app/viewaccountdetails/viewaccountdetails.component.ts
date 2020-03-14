import { BsModalRef } from 'ngx-bootstrap/modal';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../AppRestCall/user/user.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { first } from 'rxjs/operators';
import { AlertsService } from '../AppRestCall/alerts/alerts.service';
import { UserAdapter } from '../adapters/useradapter';
import { User } from '../appmodels/User';

@Component({
  selector: 'app-viewaccountdetails',
  templateUrl: './viewaccountdetails.component.html',
  styleUrls: ['./viewaccountdetails.component.css']
})
export class ViewaccountdetailsComponent implements OnInit {
  usrdetailsObj: User;
  constructor(
    public  modalRef: BsModalRef,
    private userService: UserService,
    private spinnerService: Ng4LoadingSpinnerService,
    private alertService: AlertsService,
    private userAdapter: UserAdapter,
  ) { }

  ngOnInit() {
   }
}
