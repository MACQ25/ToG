import { TestBed } from '@angular/core/testing';

import { PodConfigService } from './pod-config.service';

describe('PodConfigService', () => {
  let service: PodConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PodConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
