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
  issubmit = false;

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
}
