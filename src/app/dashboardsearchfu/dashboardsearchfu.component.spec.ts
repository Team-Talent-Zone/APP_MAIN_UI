import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardsearchfuComponent } from './dashboardsearchfu.component';

describe('DashboardsearchfuComponent', () => {
  let component: DashboardsearchfuComponent;
  let fixture: ComponentFixture<DashboardsearchfuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardsearchfuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardsearchfuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
