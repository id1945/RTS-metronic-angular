import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormExplanationModalComponent } from './form-explanation-modal.component';

describe('FormExplanationModalComponent', () => {
  let component: FormExplanationModalComponent;
  let fixture: ComponentFixture<FormExplanationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormExplanationModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormExplanationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
