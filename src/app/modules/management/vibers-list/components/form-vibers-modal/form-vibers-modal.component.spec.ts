import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormVibersModalComponent } from './form-vibers-modal.component';

describe('FormVibersModalComponent', () => {
  let component: FormVibersModalComponent;
  let fixture: ComponentFixture<FormVibersModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormVibersModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormVibersModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
