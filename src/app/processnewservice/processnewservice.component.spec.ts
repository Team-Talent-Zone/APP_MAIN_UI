import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessnewserviceComponent } from './processnewservice.component';

describe('ProcessnewserviceComponent', () => {
  let component: ProcessnewserviceComponent;
  let fixture: ComponentFixture<ProcessnewserviceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessnewserviceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessnewserviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
