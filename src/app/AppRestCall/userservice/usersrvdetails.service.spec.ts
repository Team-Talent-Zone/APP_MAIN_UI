import { TestBed } from '@angular/core/testing';

import { UsersrvdetailsService } from './usersrvdetails.service';

describe('UsersrvdetailsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UsersrvdetailsService = TestBed.get(UsersrvdetailsService);
    expect(service).toBeTruthy();
  });
});
