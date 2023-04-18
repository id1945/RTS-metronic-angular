import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveExpressDeliveryModalComponent } from './approve-express-delivery-modal.component';

describe('ApproveExpressDeliveryModalComponent', () => {
  let component: ApproveExpressDeliveryModalComponent;
  let fixture: ComponentFixture<ApproveExpressDeliveryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApproveExpressDeliveryModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveExpressDeliveryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
