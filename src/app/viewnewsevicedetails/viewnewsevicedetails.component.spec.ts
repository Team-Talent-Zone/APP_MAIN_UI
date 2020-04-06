import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewnewsevicedetailsComponent } from './viewnewsevicedetails.component';

describe('ViewnewsevicedetailsComponent', () => {
  let component: ViewnewsevicedetailsComponent;
  let fixture: ComponentFixture<ViewnewsevicedetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewnewsevicedetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewnewsevicedetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
