import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeservicesectionComponent } from './homeservicesection.component';

describe('HomeservicesectionComponent', () => {
  let component: HomeservicesectionComponent;
  let fixture: ComponentFixture<HomeservicesectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeservicesectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeservicesectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
