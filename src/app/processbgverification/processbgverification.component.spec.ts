import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessbgverificationComponent } from './processbgverification.component';

describe('ProcessbgverificationComponent', () => {
  let component: ProcessbgverificationComponent;
  let fixture: ComponentFixture<ProcessbgverificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessbgverificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessbgverificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
