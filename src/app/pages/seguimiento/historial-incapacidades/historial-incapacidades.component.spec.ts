import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialIncapacidadesComponent } from './historial-incapacidades.component';

describe('HistorialIncapacidadesComponent', () => {
  let component: HistorialIncapacidadesComponent;
  let fixture: ComponentFixture<HistorialIncapacidadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistorialIncapacidadesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistorialIncapacidadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
