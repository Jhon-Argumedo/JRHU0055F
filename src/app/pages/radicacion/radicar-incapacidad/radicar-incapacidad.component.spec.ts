import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadicarIncapacidadComponent } from './radicar-incapacidad.component';

describe('RadicarIncapacidadComponent', () => {
  let component: RadicarIncapacidadComponent;
  let fixture: ComponentFixture<RadicarIncapacidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RadicarIncapacidadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RadicarIncapacidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
