import { TestBed } from '@angular/core/testing';

import { NewformService } from './newform.service';

describe('NewformService', () => {
  let service: NewformService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewformService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
