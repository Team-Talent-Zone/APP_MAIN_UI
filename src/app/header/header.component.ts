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
  langSelected = config.default_prefer_lang;

  constructor(
    private modalService: BsModalService,
    public translate: TranslateService) {
    translate.addLangs([config.lang_english_word.toString(), config.lang_telugu_word.toString(), config.lang_hindi_word.toString()]);
    translate.setDefaultLang(config.lang_english_word.toString());
    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/English|తెలుగు|हिंदी/) ? browserLang : config.lang_english_word.toString());
  }

  ngOnInit() {
  }

  translateToLanguage(langSelect: string) {
    this.langSelected = langSelect;
    this.translate.use(langSelect);
  }

  openSignupModal(shortkey: string) {
    this.modalRef = this.modalService.show(SignupComponent, {
      initialState: {
        key: shortkey,
        langSelected: this.langSelected
      }
    });
  }

}
