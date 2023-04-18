import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCriterionKPIModalComponent } from './form-criterion-kpi-modal.component';

describe('FormCriterionKPIModalComponent', () => {
  let component: FormCriterionKPIModalComponent;
  let fixture: ComponentFixture<FormCriterionKPIModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormCriterionKPIModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormCriterionKPIModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
