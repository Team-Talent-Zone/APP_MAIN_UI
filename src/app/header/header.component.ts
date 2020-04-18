import { Router, ActivatedRoute } from '@angular/router';
import { SignupComponent } from './../signup/signup.component';
import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { TranslateService } from '@ngx-translate/core';
import { config } from 'src/app/appconstants/config';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  modalRef: BsModalRef;
  shortkey: string;
  langSelected = config.lang_english_word;
  name: string;
  langcode: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private modalService: BsModalService,
    public translate: TranslateService) {
    route.params.subscribe(params => {
      this.name = params.name;
    });
    translate.addLangs([config.lang_english_word.toString(), config.lang_telugu_word.toString(), config.lang_hindi_word.toString()]);
    translate.setDefaultLang(config.lang_english_word.toString());
    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/English|తెలుగు|हिंदी/) ? browserLang : config.lang_english_word.toString());
  }

  ngOnInit() {
    if (this.name != null) {
      this.translate.use(this.name);
      this.langSelected = this.name;
    }
  }

  translateToLanguage(langSelect: string) {
    this.langSelected = langSelect;
    this.translate.use(this.langSelected);
    this.router.navigateByUrl('home/', { skipLocationChange: true }).
      then(() => {
        this.router.navigate(['region/' + this.langSelected]);
      });
  }

  openSignupModal(shortkey: string) {
    if (this.langSelected === config.lang_code_hi.toString()) {
      this.langcode = config.lang_hindi_word.toString();
    }
    if (this.langSelected === config.lang_code_te.toString()) {
      this.langcode = config.lang_telugu_word.toString();
    }
    if (this.langSelected === config.default_prefer_lang.toString()) {
      this.langcode = config.lang_english_word.toString();
    }
    this.modalRef = this.modalService.show(SignupComponent, {
      initialState: {
        key: shortkey,
        langcode: this.langcode
      }
    });
  }

}
