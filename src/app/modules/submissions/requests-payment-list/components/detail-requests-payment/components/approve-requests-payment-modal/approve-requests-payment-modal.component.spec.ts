import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveRequestsPaymentModalComponent } from './approve-requests-payment-modal.component';

describe('ApproveRequestsPaymentModalComponent', () => {
  let component: ApproveRequestsPaymentModalComponent;
  let fixture: ComponentFixture<ApproveRequestsPaymentModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApproveRequestsPaymentModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveRequestsPaymentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
