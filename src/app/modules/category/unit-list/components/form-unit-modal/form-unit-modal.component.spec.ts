import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormUnitModalComponent } from './form-unit-modal.component';

describe('FormUnitModalComponent', () => {
  let component: FormUnitModalComponent;
  let fixture: ComponentFixture<FormUnitModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormUnitModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormUnitModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
