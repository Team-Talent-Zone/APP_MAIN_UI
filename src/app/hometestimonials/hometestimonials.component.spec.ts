import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HometestimonialsComponent } from './hometestimonials.component';

describe('HometestimonialsComponent', () => {
  let component: HometestimonialsComponent;
  let fixture: ComponentFixture<HometestimonialsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HometestimonialsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HometestimonialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
