import { UserServicedetailsAdapter } from './../adapters/userserviceadapter';
import { ReferenceAdapter } from './../adapters/referenceadapter';
import { SignupComponent } from './../signup/signup.component';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../AppRestCall/user/user.service';
import { Router } from '@angular/router';
import { config } from '../appconstants/config';
import { ActivatedRoute } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { AlertsService } from '../AppRestCall/alerts/alerts.service';
import { TranslateService } from '@ngx-translate/core';
import { UsersrvdetailsService } from '../AppRestCall/userservice/usersrvdetails.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  showmenufu: boolean;
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

  constructor(
    public userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private spinnerService: Ng4LoadingSpinnerService,
    private alertService: AlertsService,
    public translate: TranslateService,
    public signupComponent: SignupComponent,
    private refAdapter: ReferenceAdapter,
  ) {
    translate.addLangs([config.lang_english_word.toString(), config.lang_telugu_word.toString(), config.lang_hindi_word.toString()]);
    translate.setDefaultLang(config.lang_english_word.toString());
    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/English|తెలుగు|हिंदी/) ? browserLang : config.lang_english_word.toString());
  }

  ngOnInit() {
    this.signupComponent.getAllCategories(this.userService.currentUserValue.preferlang.toString());
    this.userService.getUserByUserId(this.userService.currentUserValue.userId).subscribe(
      (userresp: any) => {
        this.userService.setCurrentUserValue(userresp);
        this.translateToLanguage(this.userService.currentUserValue.preferlang.toString());
        if (this.userService.currentUserValue.userroles.rolecode === config.user_rolecode_fu) {
          if (this.userService.currentUserValue.freelancehistoryentity[0].bgstatus ===
            config.bg_code_approved) {
            this.showmenufu = true;
          }
          if (this.userService.currentUserValue.freelancehistoryentity[0].bgstatus ===
            config.bg_code_rejected) {
            this.showmenufu = false;
          }
        }
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

  search(inputItemCode: string, inputItem: string, searchByFilterName: string) {
    const obj = this.list.filter((item) => item.code.startsWith(inputItemCode));
    if (searchByFilterName.length === 1) {
      this.alertService.error(' Please select the filter');
    } else
      if (obj.length === 0) {
        this.alertService.error(' Please search or select ');
      } else {
        this.router.navigateByUrl('fusearch/', { skipLocationChange: true }).
          then(() => {
            this.router.navigate(['dashboard/' + inputItemCode + '/' + inputItem + '/' + searchByFilterName]);
          });
      }
  }

  onSearchByFilterSelected(searchByFilterName: string) {
    if (searchByFilterName === config.search_byfilter_fu) {
      this.list = [];
      this.filteredList = [];
      this.signupComponent.referencedetailsmapsubcat.forEach(element => {
        this.list.push(element);
      });
      this.filteredList = this.list;
      if (this.list.length === 0) {
        this.signupComponent.getAllCategories(this.userService.currentUserValue.preferlang.toString());
        this.filteredList = [];
        setTimeout(() => {
          this.signupComponent.referencedetailsmapsubcat.forEach((element: any) => {
            this.list.push(element);
            this.filteredList.push(element);
          });
        }, 500);
      }
    }
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
    const obj = this.refAdapter.adapt(this.filteredList[ind]);
    this.inputItem = obj.label;
    this.listHidden = true;
    this.selectedIndex = ind;
    this.inputItemCode = obj.code;
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
