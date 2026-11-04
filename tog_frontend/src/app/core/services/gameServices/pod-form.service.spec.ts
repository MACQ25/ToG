import { TestBed } from '@angular/core/testing';

import { PodFormService } from './pod-form.service';

describe('PodFormService', () => {
  let service: PodFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PodFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
