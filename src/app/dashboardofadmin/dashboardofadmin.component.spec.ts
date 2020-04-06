import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardofadminComponent } from './dashboardofadmin.component';

describe('DashboardofadminComponent', () => {
  let component: DashboardofadminComponent;
  let fixture: ComponentFixture<DashboardofadminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardofadminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardofadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
