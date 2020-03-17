import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupadminComponent } from './signupadmin.component';

describe('SignupadminComponent', () => {
  let component: SignupadminComponent;
  let fixture: ComponentFixture<SignupadminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignupadminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
