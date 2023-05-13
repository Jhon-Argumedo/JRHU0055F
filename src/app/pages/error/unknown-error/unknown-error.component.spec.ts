import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnknownErrorComponent } from './unknown-error.component';

describe('UnknownErrorComponent', () => {
  let component: UnknownErrorComponent;
  let fixture: ComponentFixture<UnknownErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnknownErrorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnknownErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
