import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardsearchbyfilterComponent } from './dashboardsearchbyfilter.component';

describe('DashboardsearchfuComponent', () => {
  let component: DashboardsearchbyfilterComponent;
  let fixture: ComponentFixture<DashboardsearchbyfilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardsearchbyfilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardsearchbyfilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
