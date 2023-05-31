import { TestBed } from '@angular/core/testing';

import { SeguimientoIncapacidadesService } from './seguimiento-incapacidades.service';

describe('SeguimientoIncapacidadesService', () => {
  let service: SeguimientoIncapacidadesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SeguimientoIncapacidadesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
