import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardoffuComponent } from './dashboardoffu.component';

describe('DashboardoffuComponent', () => {
  let component: DashboardoffuComponent;
  let fixture: ComponentFixture<DashboardoffuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardoffuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardoffuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
