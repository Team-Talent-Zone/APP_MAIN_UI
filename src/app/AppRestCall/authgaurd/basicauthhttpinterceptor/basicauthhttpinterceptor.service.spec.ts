import { TestBed } from '@angular/core/testing';

import { BasicauthhttpinterceptorService } from './basicauthhttpinterceptor.service';

describe('BasicauthhttpinterceptorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BasicauthhttpinterceptorService = TestBed.get(BasicauthhttpinterceptorService);
    expect(service).toBeTruthy();
  });
});
