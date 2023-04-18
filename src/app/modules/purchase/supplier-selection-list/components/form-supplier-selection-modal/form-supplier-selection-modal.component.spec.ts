import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSupplierSelectionModalComponent } from './form-supplier-selection-modal.component';

describe('FormSupplierSelectionModalComponent', () => {
  let component: FormSupplierSelectionModalComponent;
  let fixture: ComponentFixture<FormSupplierSelectionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormSupplierSelectionModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormSupplierSelectionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
