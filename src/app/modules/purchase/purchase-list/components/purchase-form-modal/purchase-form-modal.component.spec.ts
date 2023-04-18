import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseFormModalComponent } from './purchase-form-modal.component';

describe('PurchaseFormModalComponent', () => {
  let component: PurchaseFormModalComponent;
  let fixture: ComponentFixture<PurchaseFormModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseFormModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
