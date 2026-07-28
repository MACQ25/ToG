import { TestBed } from '@angular/core/testing';

import { SetSelectService } from './set-select.service';

describe('SetSelectService', () => {
  let service: SetSelectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SetSelectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
