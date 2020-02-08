import { SignupComponent } from './../signup/signup.component';
import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  modalRef: BsModalRef;
  shortkey: string;
  langSelected = 'English';

  constructor(
    private modalService: BsModalService,
    public translate: TranslateService) {
    translate.addLangs(['English', 'తెలుగు', 'हिंदी']);
    translate.setDefaultLang('English');
    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/English|తెలుగు|हिंदी/) ? browserLang : 'English');
  }

  ngOnInit() {
  }

  translateToLanguage(langSelect: string) {
   this.translate.use(langSelect);
  }

  openSignupModal(shortkey) {
    console.log('HeaderComponent shortkey : ', shortkey);
    this.modalRef = this.modalService.show(SignupComponent,  {
    initialState: {
      title: 'Modal title',
      key: shortkey,
      langSelected: this.langSelected
    }
  });
}

}
