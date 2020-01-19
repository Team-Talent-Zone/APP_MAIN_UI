import { ReferenceLookUpMapping } from './../AppPojo/ReferenceLookUpMapping';
import { map } from 'rxjs/operators';
import { Reference } from 'src/app/AppPojo/Reference';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Component, OnInit, Inject } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import {
  FormBuilder,
  FormGroup,
  Validators} from '@angular/forms';
import { config } from '../AppConstants/config';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  key: string;
  signupForm: FormGroup;
  issubmit = false;
  referencedetails: any = [];
  referencedetailsmap: any =  [];
  referencedetailsmapsubcat: any = [];
  referencedetailsmapsubcatselectedmapId: any = [];

  constructor(public modalRef: BsModalRef, private http: HttpClient,
              @Inject(FormBuilder) private formBuilder: FormBuilder) {
   }

  ngOnInit() {
    this.formValidations();
    this.getCategories();
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

  getCategories() {
    this.http.get<Reference[]>(`${environment.apiUrl}/getReferenceLookupByKey/` + config.key_domain,
    config.httpHeaders).subscribe((data: Reference[]) => {
      this.referencedetails = data;
      for (const reflookup of this.referencedetails ) {
      for (const reflookupmap of reflookup.referencelookupmapping) {
        this.referencedetailsmap.push(reflookupmap);
        for (const reflookupmapsubcat of reflookupmap.referencelookupmappingsubcategories) {
          this.referencedetailsmapsubcat.push(reflookupmapsubcat);
        }
      }
    }
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

  subCategoryByMapId(value: string) {
    for (const listofcat of this.referencedetailsmapsubcat) {
      if (listofcat.mapId == value) {
         this.referencedetailsmapsubcatselectedmapId.push(listofcat);
       } else {
        this.referencedetailsmapsubcatselectedmapId = [];
       }
     }
  }
}
