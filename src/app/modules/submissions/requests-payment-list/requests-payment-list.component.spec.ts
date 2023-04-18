import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestsPaymentListComponent } from './requests-payment-list.component';

describe('RequestsPaymentListComponent', () => {
  let component: RequestsPaymentListComponent;
  let fixture: ComponentFixture<RequestsPaymentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestsPaymentListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestsPaymentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
