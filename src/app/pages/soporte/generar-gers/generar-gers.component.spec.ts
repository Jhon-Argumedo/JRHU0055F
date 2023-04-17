import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerarGersComponent } from './generar-gers.component';

describe('GenerarGersComponent', () => {
  let component: GenerarGersComponent;
  let fixture: ComponentFixture<GenerarGersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerarGersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerarGersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
