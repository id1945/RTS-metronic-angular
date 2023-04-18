import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailExpressDeliveryModalComponent } from './detail-express-delivery-modal.component';

describe('DetailExpressDeliveryModalComponent', () => {
  let component: DetailExpressDeliveryModalComponent;
  let fixture: ComponentFixture<DetailExpressDeliveryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailExpressDeliveryModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailExpressDeliveryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
