import { UserService } from '../AppRestCall/user/user.service';
import { ActivatedRoute } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { first } from 'rxjs/operators';
import { AlertsService } from '../AppRestCall/alerts/alerts.service';
import { User } from '../appmodels/User';
import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { UtilService } from '../AppRestCall/util/util.service';
import { UserAdapter } from '../adapters/useradapter';
import {
  FormBuilder,
  FormGroup,
  Validators} from '@angular/forms';

@Component({
  selector: 'app-editprofile',
  templateUrl: './editprofile.component.html',
  styleUrls: ['./editprofile.component.css']
})
export class EditprofileComponent implements OnInit {

  id: number;
  edituserobj: User;
  roleCode: string;
  issubmit = false;
  /*########################## File Upload ########################*/
  el: ElementRef;
  avatarURL: any ;
  editprofileuserId: number;
  editProfileForm: FormGroup;
  usrObj: User;

  constructor(
    public fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private userService: UserService,
    private route: ActivatedRoute,
    private spinnerService: Ng4LoadingSpinnerService,
    private alertService: AlertsService,
    private utilService: UtilService,
    private formBuilder: FormBuilder,
    private userAdapter: UserAdapter,

  ) {
    route.params.subscribe(params => {
      this.id = params.id;
     });
   }

  ngOnInit() {
    this.roleCode = this.userService.currentUserValue.userroles.rolecode;
    this.openEditUser();
    this.formValidations();
  }

  formValidations() {
    this.editProfileForm = this.formBuilder.group({
      firstname: ['', [Validators.required, Validators.maxLength(40)]],
      lastname: ['', [Validators.required, Validators.maxLength(40)]],
      preferlang: ['', [Validators.required]],
    });
  }
  get f() {
    return this.editProfileForm.controls;
  }
  openEditUser() {
    if (this.id > 0) {
     this.spinnerService.show();
     this.userService.getUserByUserId(this.id).pipe(first()).subscribe(
       (respuser: any) => {
        this.edituserobj = respuser;
        this.avatarURL = this.edituserobj.avtarurl;
        this.editprofileuserId = this.edituserobj.userId;
        this.spinnerService.hide();
        this.editProfileForm.patchValue({username: this.edituserobj.username});
        this.editProfileForm.patchValue({firstname: this.edituserobj.firstname});
        this.editProfileForm.patchValue({lastname: this.edituserobj.lastname});
        this.editProfileForm.patchValue({preferlang: this.edituserobj.preferlang});
       },
       error => {
        this.alertService.error(error);
        this.spinnerService.hide();
      });
      }
  }

  saveorupdate() {
    this.issubmit = true;
    if (this.editProfileForm.invalid) {
      return;
    }
    this.edituserobj.firstname = this.editProfileForm.get('firstname').value;
    this.edituserobj.lastname = this.editProfileForm.get('lastname').value;
    this.edituserobj.preferlang = this.editProfileForm.get('preferlang').value;
    this.edituserobj.avtarurl = this.avatarURL;
    this.spinnerService.show();
    this.userService.saveorupdate(this.edituserobj).subscribe(
      (userObj: any) => {
        this.spinnerService.hide();
        this.usrObj = this.userAdapter.adapt(userObj);
        if (this.userService.currentUserValue.userId === this.usrObj.userId) {
          console.log('saveorupdate');
          this.userService.currentUserValue.avtarurl = this.edituserobj.avtarurl;
          this.userService.currentUserValue.firstname = this.edituserobj.firstname;

        }
        this.alertService.success('Profile Edited');
      },
      error => {
        this.spinnerService.hide();
        this.alertService.error(error);
      });
  }

  uploadFile(event) {
    let reader = new FileReader(); // HTML5 FileReader API
    let file = event.target.files[0];

    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(file);

      // When file uploads set it to file formcontrol
      reader.onload = () => {
        this.spinnerService.show();
        this.utilService.uploadAvatarsInS3(  reader.result , this.editprofileuserId).subscribe(
           (returnURL: string) => {
            this.spinnerService.hide();
            this.avatarURL = returnURL;
           },
           error => {
            this.spinnerService.hide();
            this.alertService.error(error);
          }
         );
      };
      // ChangeDetectorRef since file is loading outside the zone
      this.cd.markForCheck();
    }
  }
}
