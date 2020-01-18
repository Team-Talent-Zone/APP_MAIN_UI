import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  key: string;
  signupForm: FormGroup;
  issubmit = false;

  constructor(public modalRef: BsModalRef,
              @Inject(FormBuilder) private formBuilder: FormBuilder) {
   }

  ngOnInit() {
    console.log('inside SignupComponent', this.key);
    this.formValidations();
  }

  formValidations() {
    this.signupForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      username: ['', [Validators.required, Validators.email, Validators.maxLength(40)]],
      firstname: ['', [Validators.required, Validators.maxLength(40)]],
      lastname: ['', [Validators.required, Validators.maxLength(40)]],
      category: ['', [Validators.required]],
      subcategory: ['', [Validators.required]],
    });
  }

  get f() {
    return this.signupForm.controls;
  }
  onSubmit() {
    this.issubmit = true;
    if (this.signupForm.invalid) {
      return;
    }
  }

}
