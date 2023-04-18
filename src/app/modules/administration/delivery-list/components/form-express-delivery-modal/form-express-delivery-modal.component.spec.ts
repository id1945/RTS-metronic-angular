import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormExpressDeliveryModalComponent } from './form-express-delivery-modal.component';

describe('FormExpressDeliveryModalComponent', () => {
  let component: FormExpressDeliveryModalComponent;
  let fixture: ComponentFixture<FormExpressDeliveryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormExpressDeliveryModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormExpressDeliveryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
