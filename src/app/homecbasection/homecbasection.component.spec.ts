import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomecbasectionComponent } from './homecbasection.component';

describe('HomecbasectionComponent', () => {
  let component: HomecbasectionComponent;
  let fixture: ComponentFixture<HomecbasectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomecbasectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomecbasectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
