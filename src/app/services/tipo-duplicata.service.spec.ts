import { TestBed } from '@angular/core/testing';

import { TipoDuplicataService } from './tipo-duplicata.service';

describe('TipoDuplicataService', () => {
  let service: TipoDuplicataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoDuplicataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
