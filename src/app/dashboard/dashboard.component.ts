import { ReferenceAdapter } from './../adapters/referenceadapter';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../AppRestCall/user/user.service';
import { Router } from '@angular/router';
import { config } from '../appconstants/config';
import { ActivatedRoute } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { AlertsService } from '../AppRestCall/alerts/alerts.service';
import { PaymentService } from '../AppRestCall/payment/payment.service';
import { ReferenceService } from '../AppRestCall/reference/reference.service';
import { map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

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
  fullname: string;

  constructor(
    public userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private spinnerService: Ng4LoadingSpinnerService,
    private alertService: AlertsService,
    private refAdapter: ReferenceAdapter,
    private paymentsvc: PaymentService,
    private referService: ReferenceService,
    public translate: TranslateService,
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
    if (this.txtid != null) {
      this.getPaymentDetailsByTxnId(this.txtid);
    }
    setTimeout(() => {
      this.resetLoggedInUser();
    }, 1000);

    if (this.userService.currentUserValue.userroles.rolecode !== config.user_rolecode_fu.toString()) {
      this.getAllAvailableFUSkills();
    }

    if (this.userService.currentUserValue.userroles.rolecode === config.user_rolecode_fu.toString()) {
      this.fullname = null;
      if (this.userService.currentUserValue.preferlang !== config.default_prefer_lang) {
        // tslint:disable-next-line: max-line-length
        this.referService.translatetext(this.userService.currentUserValue.fullname, this.userService.currentUserValue.preferlang).subscribe(
          (trantxt: any) => {
            this.fullname = trantxt.translateresp;
          },
          error => {
            this.spinnerService.hide();
            this.alertService.error(error);
          }
        );
      } else {
        this.fullname = this.userService.currentUserValue.fullname;
      }
    } else {
      this.fullname = this.userService.currentUserValue.fullname;
    }
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
        } else {
          this.alertService.error('Transcation Failed. Please try again.');
        }
      }
      if (paymentobj.paymentsFUTrans != null) {
        if (paymentobj.paymentsFUTrans.status === 'Success') {
          this.alertService.success('Thank you for the payment. Payment is Successfully');
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
        this.translateToLanguage(userresp.preferlang.toString());
        this.spinnerService.hide();
      },
      error => {
        this.alertService.error(error);
        this.spinnerService.hide();
      });
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['/app']);
  }

  search(inputItemCode: string, inputItem: string) {
    const obj = this.list.filter((item) => item.code.startsWith(inputItemCode));
    if (obj.length === 0) {
      this.alertService.info('Enter Valid Skill Keyword To Search');
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
}
