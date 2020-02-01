import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomefusectionComponent } from './homefusection.component';

describe('HomefusectionComponent', () => {
  let component: HomefusectionComponent;
  let fixture: ComponentFixture<HomefusectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomefusectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomefusectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
