import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveSupplierModalComponent } from './approve-supplier-modal.component';

describe('ApproveSupplierModalComponent', () => {
  let component: ApproveSupplierModalComponent;
  let fixture: ComponentFixture<ApproveSupplierModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApproveSupplierModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveSupplierModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
