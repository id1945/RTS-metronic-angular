import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveRegisterVehicleModalComponent } from './approve-registervehicle-modal.component';

describe('ApproveRegisterVehicleModalComponent', () => {
  let component: ApproveRegisterVehicleModalComponent;
  let fixture: ComponentFixture<ApproveRegisterVehicleModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApproveRegisterVehicleModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveRegisterVehicleModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
