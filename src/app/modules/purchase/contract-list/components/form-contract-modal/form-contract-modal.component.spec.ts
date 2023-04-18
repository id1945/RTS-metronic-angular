import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormContractModalComponent } from './form-contract-modal.component';

describe('FormContractModalComponent', () => {
  let component: FormContractModalComponent;
  let fixture: ComponentFixture<FormContractModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormContractModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormContractModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
