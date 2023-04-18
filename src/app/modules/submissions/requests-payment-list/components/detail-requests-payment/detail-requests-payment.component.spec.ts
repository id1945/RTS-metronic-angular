import { ComponentFixture, TestBed } from '@angular/core/testing';

import {  DetailRequestsPaymentComponent } from './detail-requests-payment.component';

describe('DetailRequestsPaymentComponent', () => {
  let component: DetailRequestsPaymentComponent;
  let fixture: ComponentFixture<DetailRequestsPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailRequestsPaymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailRequestsPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
