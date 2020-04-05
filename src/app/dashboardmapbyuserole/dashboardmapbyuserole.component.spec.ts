import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardmapbyuseroleComponent } from './dashboardmapbyuserole.component';

describe('DashboardmapbyuseroleComponent', () => {
  let component: DashboardmapbyuseroleComponent;
  let fixture: ComponentFixture<DashboardmapbyuseroleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardmapbyuseroleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardbmapyuseroleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
