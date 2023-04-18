import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormVehicleModalComponent } from './form-vehicle-modal.component';

describe('FormVehicleModalComponent', () => {
  let component: FormVehicleModalComponent;
  let fixture: ComponentFixture<FormVehicleModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormVehicleModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormVehicleModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
