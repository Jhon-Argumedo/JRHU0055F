import { TestBed } from '@angular/core/testing';

import { SubtipoIncapacidadService } from './subtipo-incapacidad.service';

describe('SubtipoIncapacidadService', () => {
  let service: SubtipoIncapacidadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubtipoIncapacidadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
