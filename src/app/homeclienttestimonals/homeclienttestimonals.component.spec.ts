import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeclienttestimonalsComponent } from './homeclienttestimonals.component';

describe('HomeclienttestimonalsComponent', () => {
  let component: HomeclienttestimonalsComponent;
  let fixture: ComponentFixture<HomeclienttestimonalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeclienttestimonalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeclienttestimonalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
