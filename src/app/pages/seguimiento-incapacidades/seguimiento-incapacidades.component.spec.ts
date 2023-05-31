import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeguimientoIncapacidadesComponent } from './seguimiento-incapacidades.component';

describe('SeguimientoIncapacidadesComponent', () => {
  let component: SeguimientoIncapacidadesComponent;
  let fixture: ComponentFixture<SeguimientoIncapacidadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeguimientoIncapacidadesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeguimientoIncapacidadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
