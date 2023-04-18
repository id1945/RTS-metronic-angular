import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormKpiModalComponent } from './form-kpi-modal.component';

describe('FormKpiModalComponent', () => {
  let component: FormKpiModalComponent;
  let fixture: ComponentFixture<FormKpiModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormKpiModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormKpiModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
