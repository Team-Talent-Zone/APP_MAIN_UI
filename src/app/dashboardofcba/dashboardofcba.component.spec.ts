import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardofcbaComponent } from './dashboardofcba.component';

describe('DashboardofcbaComponent', () => {
  let component: DashboardofcbaComponent;
  let fixture: ComponentFixture<DashboardofcbaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardofcbaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardofcbaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
