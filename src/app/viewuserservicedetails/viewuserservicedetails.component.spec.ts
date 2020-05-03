import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewuserservicedetailsComponent } from './viewuserservicedetails.component';

describe('ViewuserservicedetailsComponent', () => {
  let component: ViewuserservicedetailsComponent;
  let fixture: ComponentFixture<ViewuserservicedetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewuserservicedetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewuserservicedetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
