import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormEvaluateModalComponent } from './form-evaluate-modal.component';

describe('FormEvaluateModalComponent', () => {
  let component: FormEvaluateModalComponent;
  let fixture: ComponentFixture<FormEvaluateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormEvaluateModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormEvaluateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
