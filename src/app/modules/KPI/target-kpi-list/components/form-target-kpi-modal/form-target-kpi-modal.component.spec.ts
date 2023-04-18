import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormTargetKPIModalComponent } from './form-target-kpi-modal.component';

describe('FormTargetKPIModalComponent', () => {
  let component: FormTargetKPIModalComponent;
  let fixture: ComponentFixture<FormTargetKPIModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormTargetKPIModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormTargetKPIModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
