import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormKpiPartsModalComponent } from './form-kpi-parts-modal.component';

describe('FormKpiPartsModalComponent', () => {
  let component: FormKpiPartsModalComponent;
  let fixture: ComponentFixture<FormKpiPartsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormKpiPartsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormKpiPartsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
