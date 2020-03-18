import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewserviceComponent } from './newservice.component';

describe('NewserviceComponent', () => {
  let component: NewserviceComponent;
  let fixture: ComponentFixture<NewserviceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewserviceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewserviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
