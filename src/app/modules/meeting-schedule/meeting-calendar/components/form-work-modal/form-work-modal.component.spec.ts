import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormWorkModalComponent } from './form-work-modal.component';

describe('FormWorkModalComponent', () => {
  let component: FormWorkModalComponent;
  let fixture: ComponentFixture<FormWorkModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormWorkModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormWorkModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
