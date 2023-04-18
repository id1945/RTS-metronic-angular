import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPopupModalComponent } from './form-popup-modal.component';

describe('FormPopupModalComponent', () => {
  let component: FormPopupModalComponent;
  let fixture: ComponentFixture<FormPopupModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormPopupModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormPopupModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
