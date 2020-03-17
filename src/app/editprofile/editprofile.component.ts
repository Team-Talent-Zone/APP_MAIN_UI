import { SignupComponent } from './../signup/signup.component';
import { UserService } from '../AppRestCall/user/user.service';
import { ActivatedRoute } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { first } from 'rxjs/operators';
import { AlertsService } from '../AppRestCall/alerts/alerts.service';
import { User } from '../appmodels/User';
import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { UtilService } from '../AppRestCall/util/util.service';
import { UserAdapter } from '../adapters/useradapter';
import { config } from 'src/app/appconstants/config';

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
  avatarReturnURL: any;
  nationalIDURL: any;
  nationalIDReturnURL: any;
  editprofileuserId: number;
  editprofileForm: FormGroup;
  usrObj: User;
  langSelected = 'en';
  filename: string;
  typeavt: string;
  typenationalid: string;
  msgflag = false;
  msgflagboth = false;
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
    public signupComponent: SignupComponent,
  ) {
    route.params.subscribe(params => {
      this.id = params.id;
     });
   }

  ngOnInit() {
    this.roleCode = this.userService.currentUserValue.userroles.rolecode;
    this.openEditUser();
    this.editProfileFormValidations();
    if (this.roleCode === config.user_rolecode_fu) {
      if (this.userService.currentUserValue.preferlang === 'hi') {
        this.langSelected = 'हिंदी';
      } else
      if (this.userService.currentUserValue.preferlang === 'te') {
        this.langSelected = 'తెలుగు';
      }
      this.signupComponent.getAllCategories(this.langSelected);
    }

  }

  editProfileFormValidations() {
        if (this.roleCode === config.user_rolecode_cbu) {
        this.editprofileForm = this.formBuilder.group({
        username: ['', [Validators.required]],
        firstname: ['', [Validators.required, Validators.maxLength(40)]],
        lastname: ['', [Validators.required, Validators.maxLength(40)]],
        preferlang: ['', [Validators.required]],
        fulladdress: ['', [Validators.required]],
        bizname: ['', [Validators.required, Validators.maxLength(40)]],
        biztype: ['', [Validators.required, Validators.maxLength(40)]],
        bizwebsite: ['', [Validators.required, Validators.maxLength(40)]],
        abtbiz: ['', [Validators.required]],
        purposeofsignup: ['', [Validators.required]],
        designation: ['', [Validators.required, Validators.maxLength(40)]],
      });
    } else
      if (this.roleCode === config.user_rolecode_fu) {
        this.editprofileForm = this.formBuilder.group({
        username: ['', [Validators.required]],
        firstname: ['', [Validators.required, Validators.maxLength(40)]],
        lastname: ['', [Validators.required, Validators.maxLength(40)]],
        preferlang: ['', [Validators.required]],
        fulladdress: ['', [Validators.required]],
        subCategory: ['', [Validators.required]],
        category: ['', [Validators.required]],
        experienceInField: ['', [Validators.required  , Validators.maxLength(2) , Validators.pattern('^[0-9]*$')]],
        abt: ['', [Validators.required]],
        uploadValidPhotoidImgUrl: ['', [Validators.required]],
        hourlyRate: ['', [Validators.required, Validators.maxLength(5),  Validators.pattern('^[0-9]*$')]],
      });
    }  else {
        this.editprofileForm = this.formBuilder.group({
        username: ['', [Validators.required]],
        firstname: ['', [Validators.required, Validators.maxLength(40)]],
        lastname: ['', [Validators.required, Validators.maxLength(40)]],
        preferlang: ['', [Validators.required]],
        fulladdress: ['', [Validators.required]],
             });
    }
  }
  get f() {
    return this.editprofileForm.controls;
  }
  openEditUser() {
    if (this.id > 0) {
     this.spinnerService.show();
     this.userService.getUserByUserId(this.id).pipe(first()).subscribe(
       (respuser: any) => {
        this.edituserobj = respuser;
        this.userService.currentUserValue.avtarurl = this.edituserobj.avtarurl;
        this.avatarURL = this.edituserobj.avtarurl;
        this.editprofileuserId = this.edituserobj.userId;
        this.spinnerService.hide();
        this.editprofileForm.patchValue({username: this.edituserobj.username});
        this.editprofileForm.patchValue({firstname: this.edituserobj.firstname});
        this.editprofileForm.patchValue({lastname: this.edituserobj.lastname});
        this.editprofileForm.patchValue({preferlang: this.edituserobj.preferlang});
        this.editprofileForm.patchValue({fulladdress: this.edituserobj.userbizdetails.fulladdress});
        if (this.roleCode === config.user_rolecode_cbu) {
          this.editprofileForm.patchValue({bizname: this.edituserobj.userbizdetails.bizname});
          this.editprofileForm.patchValue({biztype: this.edituserobj.userbizdetails.biztype});
          this.editprofileForm.patchValue({bizwebsite: this.edituserobj.userbizdetails.bizwebsite});
          this.editprofileForm.patchValue({abtbiz: this.edituserobj.userbizdetails.abtbiz});
          this.editprofileForm.patchValue({purposeofsignup: this.edituserobj.userbizdetails.purposeofsignup});
          this.editprofileForm.patchValue({designation: this.edituserobj.userbizdetails.designation});
        }
        if (this.roleCode === config.user_rolecode_fu) {
          this.editprofileForm.patchValue({category: this.edituserobj.freeLanceDetails.category});
          this.editprofileForm.patchValue({experienceInField: this.edituserobj.freeLanceDetails.experienceInField});
          this.editprofileForm.patchValue({subCategory: this.edituserobj.freeLanceDetails.subCategory});
          this.editprofileForm.patchValue({abt: this.edituserobj.freeLanceDetails.abt});
          this.editprofileForm.patchValue({hourlyRate: this.edituserobj.freeLanceDetails.hourlyRate});
          this.nationalIDURL = this.edituserobj.freeLanceDetails.uploadValidPhotoidImgUrl;
          this.editprofileForm.patchValue({uploadValidPhotoidImgUrl: this.edituserobj.freeLanceDetails.uploadValidPhotoidImgUrl});
            }
         },
       error => {
        this.alertService.error(error);
        this.spinnerService.hide();
      });
      }
  }

  saveorupdateeditprofile() {
    if (this.roleCode === config.user_rolecode_fu) {
        this.editprofileForm.patchValue({uploadValidPhotoidImgUrl: this.nationalIDURL});
    }
    this.issubmit = true;
    if (this.editprofileForm.invalid) {
      return;
    }
    this.spinnerService.show();
    this.edituserobj.username = this.editprofileForm.get('username').value;
    this.edituserobj.firstname = this.editprofileForm.get('firstname').value;
    this.edituserobj.lastname = this.editprofileForm.get('lastname').value;
    this.edituserobj.preferlang = this.editprofileForm.get('preferlang').value;
    this.edituserobj.userbizdetails.fulladdress = this.editprofileForm.get('fulladdress').value;
    if (this.roleCode === config.user_rolecode_cbu) {
      this.edituserobj.userbizdetails.bizname = this.editprofileForm.get('bizname').value;
      this.edituserobj.userbizdetails.biztype = this.editprofileForm.get('biztype').value;
      this.edituserobj.userbizdetails.bizwebsite = this.editprofileForm.get('bizwebsite').value;
      this.edituserobj.userbizdetails.abtbiz = this.editprofileForm.get('abtbiz').value;
      this.edituserobj.userbizdetails.purposeofsignup = this.editprofileForm.get('purposeofsignup').value;
      this.edituserobj.userbizdetails.designation = this.editprofileForm.get('designation').value;
    }
    if (this.roleCode === config.user_rolecode_fu) {
      this.edituserobj.freeLanceDetails.category = this.editprofileForm.get('category').value;
      this.edituserobj.freeLanceDetails.experienceInField = this.editprofileForm.get('experienceInField').value;
      this.edituserobj.freeLanceDetails.subCategory = this.editprofileForm.get('subCategory').value;
      this.edituserobj.freeLanceDetails.abt = this.editprofileForm.get('abt').value;
      this.edituserobj.freeLanceDetails.hourlyRate = this.editprofileForm.get('hourlyRate').value;
      if (this.edituserobj.freeLanceDetails.experienceInField != null &&
        this.edituserobj.freeLanceDetails.hourlyRate != null &&
        this.edituserobj.freeLanceDetails.uploadValidPhotoidImgUrl != null &&
        this.edituserobj.userbizdetails.fulladdress != null) {
        this.edituserobj.freeLanceDetails.isprofilecompleted = true;
        this.edituserobj.freelancehistoryentity[0].bgstatus = config.bg_code_completedprofile;
        }
    }
    if (this.typeavt === 'avatar' && this.typenationalid !== 'nationalid') {
      this.msgflag = true;
    } else
    if (this.typeavt !== 'avatar' && this.typenationalid === 'nationalid') {
      this.msgflag = true;
    } else
    if (this.typenationalid !== 'nationalid' && this.typeavt !== 'avatar') {
      this.msgflag = true;
    }
    if (this.typenationalid !== 'nationalid' && this.typeavt !== 'avatar') {
      this.saveorupdateedituser(this.edituserobj , null );
      if (this.msgflag) {
        this.alertService.success( this.edituserobj.firstname + ' your account details');
        this.msgflag = false;
        this.spinnerService.hide();
      }
    } else
    if (this.typeavt === 'avatar') {
        this.utilService.uploadAvatarsInS3( this.avatarURL , this.editprofileuserId , this.filename).subscribe(
           (returnURL: string) => {
            this.edituserobj.avtarurl = returnURL;
            this.saveorupdateedituser(this.edituserobj , this.typeavt);
            if (this.msgflag) {
             this.alertService.success( this.edituserobj.firstname + ' your account details is updated with profile pic');
             this.msgflag = false;
             this.typeavt = null;
             this.spinnerService.hide();
            }
          }
        );
    }
    if (this.typenationalid === 'nationalid') {
      this.utilService.uploadBgDocsInS3(this.nationalIDURL , this.editprofileuserId , this.filename).subscribe(
        (returnURL: string) => {
            console.log(' typenationalid: ' , this.typenationalid);
            console.log(' typeavt: ' , this.typeavt);
            if (this.typenationalid === 'nationalid' && this.typeavt === 'avatar') {
              this.msgflagboth = true;
            }
            this.edituserobj.freeLanceDetails.uploadValidPhotoidImgUrl = returnURL;
            this.saveorupdateedituser(this.edituserobj , this.typenationalid);
            if (this.msgflag) {
              this.alertService.success( this.edituserobj.firstname + ' your account details is updated with photo id');
              this.msgflag = false;
              this.typenationalid = null;
              this.spinnerService.hide();

             }
            if (this.msgflagboth) {
              this.alertService.success( this.edituserobj.firstname + ' your account details');
              this.msgflagboth = false;
              this.typenationalid = null;
              this.typeavt = null;
              this.spinnerService.hide();
            }
          }
        );
    }
  }

  private saveorupdateedituser(edituserobj: User , type: any) {
     this.userService.saveorupdate(edituserobj).subscribe(
      (userObj: any) => {
        this.usrObj = this.userAdapter.adapt(userObj);
        if (this.userService.currentUserValue.userId === this.usrObj.userId) {
          this.userService.currentUserValue.avtarurl = this.usrObj.avtarurl;
          this.userService.currentUserValue.firstname = this.usrObj.firstname;
        }
        this.edituserobj = userObj;
       },
      error => {
        this.spinnerService.hide();
        this.alertService.error(error);
      });
  }

  uploadFile(event , type) {
    let reader = new FileReader(); // HTML5 FileReader API
    let file = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(file);

      // When file uploads set it to file formcontrol
      reader.onload = () => {
        this.filename = file.name;
        if (type === 'avatar') {
          this.typeavt = type;
          this.avatarURL = reader.result;
        }
        if (type === 'nationalid') {
          this.typenationalid = type;
          this.nationalIDURL = reader.result;
        }
        this.spinnerService.show();
        this.spinnerService.hide();
      };
      // ChangeDetectorRef since file is loading outside the zone
      this.cd.markForCheck();
    }
  }
}
