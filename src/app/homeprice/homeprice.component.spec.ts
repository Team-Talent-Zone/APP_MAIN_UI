import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomepriceComponent } from './homeprice.component';

describe('HomepriceComponent', () => {
  let component: HomepriceComponent;
  let fixture: ComponentFixture<HomepriceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomepriceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomepriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
