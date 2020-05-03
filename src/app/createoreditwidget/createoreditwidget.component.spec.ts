import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateoreditwidgetComponent } from './createoreditwidget.component';

describe('CreateoreditwidgetComponent', () => {
  let component: CreateoreditwidgetComponent;
  let fixture: ComponentFixture<CreateoreditwidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateoreditwidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateoreditwidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
