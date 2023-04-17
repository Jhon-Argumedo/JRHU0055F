import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentacionIncapacidadComponent } from './documentacion-incapacidad.component';

describe('DocumentacionIncapacidadComponent', () => {
  let component: DocumentacionIncapacidadComponent;
  let fixture: ComponentFixture<DocumentacionIncapacidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentacionIncapacidadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentacionIncapacidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
