import { TestBed } from '@angular/core/testing';

import { NodeapiService } from './nodeapi.service';

describe('NodeapiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NodeapiService = TestBed.get(NodeapiService);
    expect(service).toBeTruthy();
  });
});
