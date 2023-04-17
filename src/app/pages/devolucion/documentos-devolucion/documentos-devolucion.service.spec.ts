import { TestBed } from '@angular/core/testing';

import { DocumentosDevolucionService } from './documentos-devolucion.service';

describe('DocumentosDevolucionService', () => {
  let service: DocumentosDevolucionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocumentosDevolucionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
