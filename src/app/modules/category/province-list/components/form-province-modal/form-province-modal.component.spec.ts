import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormProvinceModalComponent } from './form-province-modal.component';

describe('FormProvinceModalComponent', () => {
  let component: FormProvinceModalComponent;
  let fixture: ComponentFixture<FormProvinceModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormProvinceModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormProvinceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
