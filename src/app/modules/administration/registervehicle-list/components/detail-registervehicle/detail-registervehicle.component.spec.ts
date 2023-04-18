import { ComponentFixture, TestBed } from '@angular/core/testing';

import {  DetailRegisterVehicleComponent } from './detail-registervehicle.component';

describe('DetailRegisterVehicleComponent', () => {
  let component: DetailRegisterVehicleComponent;
  let fixture: ComponentFixture<DetailRegisterVehicleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailRegisterVehicleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailRegisterVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
