import { Component, OnInit, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import { UserService } from '../AppRestCall/user/user.service';
import { AlertsService } from '../AppRestCall/alerts/alerts.service';
import { UserAdapter } from '../adapters/useradapter';
import { User } from '../appmodels/User';
import { map, first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  fpwdForm: FormGroup;
  issubmit = false;
  isfpwdsubmit = false;
  isfwd = false;
  usrObj: User;

  constructor(
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private alertService: AlertsService,
    private userAdapter: UserAdapter,
    private router: Router,
    private spinnerService: Ng4LoadingSpinnerService,
    ) {
      }

  ngOnInit() {
    console.log('inside LoginComponent');
    this.formValidations();
  }

  formValidations() {
    this.loginForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      username: ['', [Validators.required, Validators.email, Validators.maxLength(40)]]
      });
    this.fpwdForm = this.formBuilder.group({
          fpwdusername: ['', [Validators.required, Validators.email, Validators.maxLength(40)]]
        });
  }

  get f() {
    return this.loginForm.controls;
  }

  loginUserByUsername() {
    this.issubmit = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.spinnerService.show();
    this.userService.checkusername(
      this.loginForm.get('username').value
      ).subscribe(
        (data: any) => {
          this.userService.loginUserByUsername(
            this.loginForm.get('username').value)
            .pipe(first()).subscribe(
              (resp) => {
                this.spinnerService.hide();
                this.router.navigate(['/dashboard']);
              },
              error => {
                this.spinnerService.hide();
                this.alertService.error(error);
              }
            );
        },
        error => {
          this.spinnerService.hide();
          this.alertService.error(error);
        //  this.router.navigate(['/dashboard']);
        });


  }
  get fpwd() {
    return this.fpwdForm.controls;
  }
  disFwd(isfwd: boolean) {
    this.isfwd = isfwd;
  }
}
