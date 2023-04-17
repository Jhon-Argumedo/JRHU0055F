import { TestBed } from '@angular/core/testing';

import { RadicarIncapacidadService } from './radicar-incapacidad.service';

describe('RadicarIncapacidadService', () => {
  let service: RadicarIncapacidadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RadicarIncapacidadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
