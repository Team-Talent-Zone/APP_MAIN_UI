import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardbyuseroleComponent } from './dashboardbyuserole.component';

describe('DashboardbyuseroleComponent', () => {
  let component: DashboardbyuseroleComponent;
  let fixture: ComponentFixture<DashboardbyuseroleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardbyuseroleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardbyuseroleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
