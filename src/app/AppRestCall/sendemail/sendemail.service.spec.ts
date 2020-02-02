import { TestBed } from '@angular/core/testing';

import { SendemailService } from './sendemail.service';

describe('SendemailService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SendemailService = TestBed.get(SendemailService);
    expect(service).toBeTruthy();
  });
});
