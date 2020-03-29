import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageuserserviceComponent } from './manageuserservice.component';

describe('ManageuserserviceComponent', () => {
  let component: ManageuserserviceComponent;
  let fixture: ComponentFixture<ManageuserserviceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageuserserviceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageuserserviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
