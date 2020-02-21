import { TestBed } from '@angular/core/testing';

import { NewsvcService } from './newsvc.service';

describe('NewsvcService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NewsvcService = TestBed.get(NewsvcService);
    expect(service).toBeTruthy();
  });
});
