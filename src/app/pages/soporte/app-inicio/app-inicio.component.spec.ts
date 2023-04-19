import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppInicioComponent } from './app-inicio.component';

describe('AppInicioComponent', () => {
  let component: AppInicioComponent;
  let fixture: ComponentFixture<AppInicioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppInicioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppInicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
