import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoIncapacidadComponent } from './tipo-incapacidad.component';

describe('TipoIncapacidadComponent', () => {
  let component: TipoIncapacidadComponent;
  let fixture: ComponentFixture<TipoIncapacidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TipoIncapacidadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TipoIncapacidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
