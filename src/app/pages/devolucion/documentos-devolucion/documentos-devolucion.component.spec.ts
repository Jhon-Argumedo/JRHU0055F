import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentosDevolucionComponent } from './documentos-devolucion.component';

describe('DocumentosDevolucionComponent', () => {
  let component: DocumentosDevolucionComponent;
  let fixture: ComponentFixture<DocumentosDevolucionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentosDevolucionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentosDevolucionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
