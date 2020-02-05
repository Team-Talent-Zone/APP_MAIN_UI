import { Component, OnInit } from '@angular/core';
import { UserService } from '../AppRestCall/user/user.service';
import { ActivatedRoute } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ConfirmationComponent } from '../confirmation/confirmation.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  modalRef: BsModalRef;
  id: number;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private modalService: BsModalService,
    ) {
      route.params.subscribe(params => (this.id = params.id));
      if (this.id > 0) {
        this.modalRef = this.modalService.show(ConfirmationComponent,  {
          initialState: {
            title: 'Confirmation Model title',
            id: this.id
          }
        });
      }
      }

  ngOnInit() {
    if (this.userService.currentUserValue) {
      console.log('Current User Object' , this.userService.currentUserValue);
      }
  }

}

