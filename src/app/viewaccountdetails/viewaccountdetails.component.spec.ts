import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewaccountdetailsComponent } from './viewaccountdetails.component';

describe('ViewaccountdetailsComponent', () => {
  let component: ViewaccountdetailsComponent;
  let fixture: ComponentFixture<ViewaccountdetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewaccountdetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewaccountdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
