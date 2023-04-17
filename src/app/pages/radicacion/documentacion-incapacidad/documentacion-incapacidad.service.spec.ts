import { TestBed } from '@angular/core/testing';

import { DocumentacionIncapacidadService } from './documentacion-incapacidad.service';

describe('DocumentacionIncapacidadService', () => {
  let service: DocumentacionIncapacidadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocumentacionIncapacidadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
