import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymenthistComponent } from './paymenthist.component';

describe('PaymenthistComponent', () => {
  let component: PaymenthistComponent;
  let fixture: ComponentFixture<PaymenthistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymenthistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymenthistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
