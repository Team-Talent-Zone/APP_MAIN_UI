import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersubscribeservicesComponent } from './usersubscribeservices.component';

describe('UsersubscribeservicesComponent', () => {
  let component: UsersubscribeservicesComponent;
  let fixture: ComponentFixture<UsersubscribeservicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersubscribeservicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersubscribeservicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
