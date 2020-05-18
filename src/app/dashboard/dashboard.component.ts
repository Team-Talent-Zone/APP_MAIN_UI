import { ReferenceAdapter } from './../adapters/referenceadapter';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../AppRestCall/user/user.service';
import { Router } from '@angular/router';
import { config } from '../appconstants/config';
import { ActivatedRoute } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { AlertsService } from '../AppRestCall/alerts/alerts.service';
import { TranslateService } from '@ngx-translate/core';
import { PaymentService } from '../AppRestCall/payment/payment.service';
import { timer } from 'rxjs';
import { ToastConfig, Toaster, ToastType } from 'ngx-toast-notifications';
import { ConfigMsg } from '../appconstants/configmsg';
import { ReferenceService } from '../AppRestCall/reference/reference.service';
import { map, first } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  private types: Array<ToastType> = ['success', 'danger', 'warning', 'info', 'primary', 'secondary', 'dark', 'light'];

  name: string;
  list = [];
  filteredList: string[] = [];

  // two way binding for input text
  inputItem: any;
  selectedItem: any;
  // enable or disable visiblility of dropdown
  listHidden = true;
  showError = false;
  selectedIndex = -1;
  // the list to be shown after filtering

  filterOn = '0';
  inputItemCode: string;
  txtid: string;
  ispaysuccess = false;

  defaultTxtImg: string = '//placehold.it/200/dddddd/fff?text=' + this.getNameInitials(this.userService.currentUserValue.fullname);


  constructor(
    public userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private spinnerService: Ng4LoadingSpinnerService,
    private alertService: AlertsService,
    public translate: TranslateService,
    private refAdapter: ReferenceAdapter,
    private paymentsvc: PaymentService,
    private toaster: Toaster,
    private referService: ReferenceService,
  ) {
    route.params.subscribe(params => {
      this.txtid = params.txtid;
    });
    translate.addLangs([config.lang_english_word.toString(), config.lang_telugu_word.toString(), config.lang_hindi_word.toString()]);
    translate.setDefaultLang(config.lang_english_word.toString());
    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/English|తెలుగు|हिंदी/) ? browserLang : config.lang_english_word.toString());
  }

  ngOnInit() {
    const source = timer(1000, 20000);
    source.subscribe((val: number) => {
      this.autoToastNotifications();
    });

    if (this.txtid != null) {
      this.getPaymentDetailsByTxnId(this.txtid);
    }

    setTimeout(() => {
      this.resetLoggedInUser();
    }, 100);

    if (this.userService.currentUserValue.userroles.rolecode === config.user_rolecode_cba.toString()) {
      this.getAllAvailableFUSkills();
    }
  }

  autoToastNotifications() {
    if (this.userService.currentUserValue.userroles.rolecode === config.user_rolecode_fu.toString()) {
      if (!this.userService.currentUserValue.freeLanceDetails.isprofilecompleted) {
        // tslint:disable-next-line: max-line-length
        let msg = 'Hi ' + this.userService.currentUserValue.fullname + ', ' + ConfigMsg.toast_notification_fu_isprofilenotcompelted;
        this.showToastNotification(msg, this.types[3], 'Profile');
      } else
        if (!this.userService.currentUserValue.freeLanceDetails.isregfeedone) {
          // tslint:disable-next-line: max-line-length
          let msg = 'Hi ' + this.userService.currentUserValue.fullname + ', ' + ConfigMsg.toast_notification_fu_isregfeenotcompelted;
          this.showToastNotification(msg, this.types[2], 'Payment');
        }
    }

    if (this.userService.currentUserValue.userroles.rolecode === config.user_rolecode_cba.toString()) {

    }

    if (this.userService.currentUserValue.userroles.rolecode === config.user_rolecode_csct.toString()) {

    }

    if (this.userService.currentUserValue.userroles.rolecode === config.user_rolecode_cscm.toString()) {

    }

  }
  showToastNotification(txtmsg: string, typeName: any, toastheader: string) {
    const type = typeName;
    this.toaster.open({
      text: txtmsg,
      caption: toastheader + ' Notification',
      type: type,
    });
  }

  getNameInitials(fullname: string) {
    let initials = fullname.match(/\b\w/g) || [];
    let initialsfinal = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
    return initialsfinal;
  }

  getPaymentDetailsByTxnId(txnid: string) {
    this.paymentsvc.getPaymentDetailsByTxnId(txnid).subscribe((paymentobj: any) => {
      if (paymentobj.paymentsCBATrans != null) {
        if (paymentobj.paymentsCBATrans.status === 'Success') {
          this.ispaysuccess = true;
          // tslint:disable-next-line: max-line-length
          this.alertService.success('Thank you for the payment. Payment is Successfully');
        }
      } else {
        if (paymentobj.paymentsFUTrans != null) {
          if (paymentobj.paymentsFUTrans.status === 'Success') {
            this.alertService.success('Thank you for the payment. Payment is Successfully');
          } else {
            this.alertService.error('Transcation Failed. Please try again.');
          }
        } else {
          this.alertService.error('Transcation Failed. Please try again.');
        }
      }
    },
      error => {
        this.alertService.error(error);
        this.spinnerService.hide();
      });
  }
  private resetLoggedInUser() {
    this.userService.getUserByUserId(this.userService.currentUserValue.userId).subscribe(
      (userresp: any) => {
        this.userService.setCurrentUserValue(userresp);
        this.translateToLanguage(this.userService.currentUserValue.preferlang.toString());
        this.spinnerService.hide();
      },
      error => {
        this.alertService.error(error);
        this.spinnerService.hide();
      });
  }

  translateToLanguage(preferedLang: string) {
    if (preferedLang === config.lang_code_hi.toString()) {
      preferedLang = config.lang_hindi_word.toString();
    }
    if (preferedLang === config.lang_code_te.toString()) {
      preferedLang = config.lang_telugu_word.toString();
    }
    if (preferedLang === config.default_prefer_lang.toString()) {
      preferedLang = config.lang_english_word.toString();
    }
    this.translate.use(preferedLang);
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['/app']);
  }

  search(inputItemCode: string, inputItem: string) {
    const obj = this.list.filter((item) => item.code.startsWith(inputItemCode));
    if (obj.length === 0) {
      this.alertService.error('Enter Valid Skill Keyword To Search');
    } else {
      this.router.navigateByUrl('fusearch/', { skipLocationChange: true }).
        then(() => {
          this.router.navigate(['dashboard/' + inputItemCode + '/' + inputItem]);
        });
    }
  }

  getAllAvailableFUSkills() {
    this.list = [];
    this.referService.getReferenceLookupByKey(config.key_domain.toString()).pipe(map((data: any[]) =>
      data.map(item => this.refAdapter.adapt(item))),
    ).subscribe(
      data => {
        data[0].referencelookupmapping[0].referencelookupmappingsubcategories.forEach(element => {
          this.list.push(element);
        });
      });
  }

  // modifies the filtered list as per input
  getFilteredList() {
    this.listHidden = false;
    // this.selectedIndex = 0;
    if (!this.listHidden && this.inputItem !== undefined) {
      this.filteredList = this.list.filter((item) => item.label.toLowerCase().startsWith(this.inputItem.toLowerCase()));
    }
  }

  // select highlighted item when enter is pressed or any item that is clicked
  selectItem(ind) {
    if (ind > -1) {
      const obj = this.refAdapter.adapt(this.filteredList[ind]);
      this.inputItem = obj.label;
      this.listHidden = true;
      this.selectedIndex = ind;
      this.inputItemCode = obj.code;
    }
  }

  // navigate through the list of items
  onKeyPress(event) {
    if (!this.listHidden) {
      if (event.key === 'Escape') {
        this.selectedIndex = -1;
        this.toggleListDisplay(0);
      }
      if (event.key === 'Enter') {
        this.toggleListDisplay(0);
      }
      if (event.key === 'ArrowDown') {
        this.listHidden = false;
        this.selectedIndex = (this.selectedIndex + 1) % this.filteredList.length;
        if (this.filteredList.length > 0 && !this.listHidden) {
          document.getElementsByTagName('list-item')[this.selectedIndex].scrollIntoView();
        }
      } else if (event.key === 'ArrowUp') {
        this.listHidden = false;
        if (this.selectedIndex <= 0) {
          this.selectedIndex = this.filteredList.length;
        }
        this.selectedIndex = (this.selectedIndex - 1) % this.filteredList.length;
        if (this.filteredList.length > 0 && !this.listHidden) {
          document.getElementsByTagName('list-item')[this.selectedIndex].scrollIntoView();
        }
      }
    }
  }

  // show or hide the dropdown list when input is focused or moves out of focus
  toggleListDisplay(sender: number) {
    if (sender === 1) {
      // this.selectedIndex = -1;
      this.listHidden = false;
      this.getFilteredList();
    } else {
      // helps to select item by clicking
      setTimeout(() => {
        this.selectItem(this.selectedIndex);
        this.listHidden = true;
        if (!this.list.filter(items => items.label.toLowerCase().includes(this.inputItem.toLowerCase()))) {
          this.showError = true;
          this.filteredList = this.list;
        } else {
          this.showError = false;
        }
      }, 500);
    }
  }
}
