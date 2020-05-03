import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagejobsComponent } from './managejobs.component';

describe('ManagejobsComponent', () => {
  let component: ManagejobsComponent;
  let fixture: ComponentFixture<ManagejobsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagejobsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagejobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
