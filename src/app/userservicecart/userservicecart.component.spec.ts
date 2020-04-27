import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserservicecartComponent } from './userservicecart.component';

describe('UserservicecartComponent', () => {
  let component: UserservicecartComponent;
  let fixture: ComponentFixture<UserservicecartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserservicecartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserservicecartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
