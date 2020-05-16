import { TestBed } from '@angular/core/testing';

import { FreelanceserviceService } from './freelanceservice.service';

describe('FreelanceserviceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FreelanceserviceService = TestBed.get(FreelanceserviceService);
    expect(service).toBeTruthy();
  });
});
