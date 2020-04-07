import { Component, OnInit } from '@angular/core';
import { UserService } from '../AppRestCall/user/user.service';
import { Router } from '@angular/router';
import { User } from '../appmodels/User';
import { config } from '../appconstants/config';
import { ActivatedRoute } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { AlertsService } from '../AppRestCall/alerts/alerts.service';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  showmenufu: boolean;
  name: string;

  constructor(
    public userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private spinnerService: Ng4LoadingSpinnerService,
    private alertService: AlertsService,
    public translate: TranslateService
  ) {
    route.params.subscribe(params => {
      this.name = params.name;
    });
    translate.addLangs([config.lang_english_word.toString(), config.lang_telugu_word.toString(), config.lang_hindi_word.toString()]);
    translate.setDefaultLang(config.lang_english_word.toString());
    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/English|తెలుగు|हिंदी/) ? browserLang : config.lang_english_word.toString());

  }

  ngOnInit() {
    this.spinnerService.show();
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
}
