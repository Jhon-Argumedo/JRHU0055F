import { TestBed } from '@angular/core/testing';

import { HistorialIncapacidadesService } from './historial-incapacidades.service';

describe('HistorialIncapacidadesService', () => {
  let service: HistorialIncapacidadesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistorialIncapacidadesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
