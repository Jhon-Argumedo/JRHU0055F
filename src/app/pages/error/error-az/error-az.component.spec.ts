import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorAzComponent } from './error-az.component';

describe('ErrorAzComponent', () => {
  let component: ErrorAzComponent;
  let fixture: ComponentFixture<ErrorAzComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ErrorAzComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErrorAzComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
