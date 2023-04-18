import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDepartmentModalComponent } from './form-department-modal.component';

describe('FormDepartmentModalComponent', () => {
  let component: FormDepartmentModalComponent;
  let fixture: ComponentFixture<FormDepartmentModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormDepartmentModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormDepartmentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
