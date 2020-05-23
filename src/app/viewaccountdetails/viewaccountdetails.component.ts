import { BsModalRef } from 'ngx-bootstrap/modal';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../AppRestCall/user/user.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { first } from 'rxjs/operators';
import { AlertsService } from '../AppRestCall/alerts/alerts.service';
import { UserAdapter } from '../adapters/useradapter';
import { User } from '../appmodels/User';
import { SignupComponent } from './../signup/signup.component';
import { ManageuserComponent } from '../manageuser/manageuser.component';
import { config } from 'src/app/appconstants/config';

@Component({
  selector: 'app-viewaccountdetails',
  templateUrl: './viewaccountdetails.component.html',
  styleUrls: ['./viewaccountdetails.component.css']
})
export class ViewaccountdetailsComponent implements OnInit {
  usrdetailsObj: User;
  edituserobj: User;
  edituserobj2: User;
  mapurl: string;

  constructor(
    public modalRef: BsModalRef,
    private userService: UserService,
    private spinnerService: Ng4LoadingSpinnerService,
    private alertService: AlertsService,
    private userAdapter: UserAdapter,
    public signupComponent: SignupComponent,
    public managerusercomponent: ManageuserComponent,
  ) { }

  ngOnInit() {
    // tslint:disable-next-line: max-line-length
    this.mapurl = 'http://maps.google.com/?q=' + this.usrdetailsObj.userbizdetails.lat + ',' + this.usrdetailsObj.userbizdetails.lng + '&z=16';
    this.findManager();
    this.signupComponent.getAllCategories(config.default_prefer_lang.toString());

  }

  findManager() {
    // tslint:disable-next-line: max-line-length
    if (this.usrdetailsObj.userroles.rolecode === 'CORE_SERVICE_SUPPORT_TEAM' ||
      this.usrdetailsObj.userroles.rolecode === 'CORE_SERVICE_SUPPORT_MANAGER') {
      this.userService.getUserByUserId(this.usrdetailsObj.usermanagerdetailsentity.managerid).pipe(first()).subscribe(
        (respuser: any) => {
          this.edituserobj2 = respuser;
        },
        error => {
          this.spinnerService.hide();
          this.alertService.error(error);
        }
      );
    }
  }


}

