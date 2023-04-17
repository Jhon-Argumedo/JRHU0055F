import { TestBed } from '@angular/core/testing';

import { IncapacidadesDevueltasService } from './incapacidades-devueltas.service';

describe('IncapacidadesDevueltasService', () => {
  let service: IncapacidadesDevueltasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IncapacidadesDevueltasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
