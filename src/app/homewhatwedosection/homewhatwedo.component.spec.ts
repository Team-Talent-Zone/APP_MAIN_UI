import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomewhatwedoComponent } from './homewhatwedo.component';

describe('HomewhatwedoComponent', () => {
  let component: HomewhatwedoComponent;
  let fixture: ComponentFixture<HomewhatwedoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomewhatwedoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomewhatwedoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
