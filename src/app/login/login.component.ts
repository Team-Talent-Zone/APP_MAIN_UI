import { Component, OnInit, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';

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
  constructor(@Inject(FormBuilder) private formBuilder: FormBuilder) {
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
  onSubmit() {
    this.issubmit = true;
    if (this.loginForm.invalid) {
      return;
    }
  }
  get fpwd() {
    return this.fpwdForm.controls;
  }
  disFwd(isfwd: boolean) {
    this.isfwd = isfwd;
    console.log(this.isfwd);
  }
}
