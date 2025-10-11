import { TestBed } from '@angular/core/testing';

import { DuplicataService } from './duplicata.service';

describe('DuplicataService', () => {
  let service: DuplicataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DuplicataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
