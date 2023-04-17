import { TestBed } from '@angular/core/testing';

import { ObservacionIncapacidadService } from './observacion-incapacidad.service';

describe('ObservacionIncapacidadService', () => {
  let service: ObservacionIncapacidadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ObservacionIncapacidadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
