import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewfujobdetailsComponent } from './viewfujobdetails.component';

describe('ViewfujobdetailsComponent', () => {
  let component: ViewfujobdetailsComponent;
  let fixture: ComponentFixture<ViewfujobdetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewfujobdetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewfujobdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
