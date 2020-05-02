import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Error504pageComponent } from './error504page.component';

describe('Error504pageComponent', () => {
  let component: Error504pageComponent;
  let fixture: ComponentFixture<Error504pageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Error504pageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Error504pageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
