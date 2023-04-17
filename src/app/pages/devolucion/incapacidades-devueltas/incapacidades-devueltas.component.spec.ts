import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncapacidadesDevueltasComponent } from './incapacidades-devueltas.component';

describe('IncapacidadesDevueltasComponent', () => {
  let component: IncapacidadesDevueltasComponent;
  let fixture: ComponentFixture<IncapacidadesDevueltasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncapacidadesDevueltasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncapacidadesDevueltasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
