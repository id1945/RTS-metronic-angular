import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDistrictModalComponent } from './form-district-modal.component';

describe('FormDistrictModalComponent', () => {
  let component: FormDistrictModalComponent;
  let fixture: ComponentFixture<FormDistrictModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormDistrictModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormDistrictModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
