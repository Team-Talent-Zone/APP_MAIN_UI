import { TestBed } from '@angular/core/testing';

import { FreelanceOnSvcService } from './freelance-on-svc.service';

describe('FreelanceOnSvcService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FreelanceOnSvcService = TestBed.get(FreelanceOnSvcService);
    expect(service).toBeTruthy();
  });
});
