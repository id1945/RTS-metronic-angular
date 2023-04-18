import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportExpressDeliveryModalComponent } from './transport-express-delivery-modal.component';

describe('TransportExpressDeliveryModalComponent', () => {
  let component: TransportExpressDeliveryModalComponent;
  let fixture: ComponentFixture<TransportExpressDeliveryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransportExpressDeliveryModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransportExpressDeliveryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
