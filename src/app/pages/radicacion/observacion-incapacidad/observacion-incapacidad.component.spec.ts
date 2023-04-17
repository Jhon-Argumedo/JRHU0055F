import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObservacionIncapacidadComponent } from './observacion-incapacidad.component';

describe('ObservacionIncapacidadComponent', () => {
  let component: ObservacionIncapacidadComponent;
  let fixture: ComponentFixture<ObservacionIncapacidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ObservacionIncapacidadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ObservacionIncapacidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
