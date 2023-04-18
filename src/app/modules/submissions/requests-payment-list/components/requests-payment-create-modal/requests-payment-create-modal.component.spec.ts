import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestsPaymentCreateModalComponent } from './requests-payment-create-modal.component';

describe('RequestsPaymentCreateModalComponent', () => {
  let component: RequestsPaymentCreateModalComponent;
  let fixture: ComponentFixture<RequestsPaymentCreateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestsPaymentCreateModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestsPaymentCreateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
