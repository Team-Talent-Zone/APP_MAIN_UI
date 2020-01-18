import { SignupComponent } from './../signup/signup.component';
import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  modalRef: BsModalRef;
  shortkey: string;

  constructor(private modalService: BsModalService) { }

  ngOnInit() {
    console.log('inside HeaderComponent');
  }

    openSignupModal(shortkey) {
    console.log('HeaderComponent shortkey : ', shortkey);

    this.modalRef = this.modalService.show(SignupComponent,  {
      initialState: {
        title: 'Modal title',
        key: shortkey
      }
    });
  }

}
