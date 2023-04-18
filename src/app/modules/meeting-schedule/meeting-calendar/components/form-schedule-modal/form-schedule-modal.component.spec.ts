import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormScheduleModalComponent } from './form-schedule-modal.component';

describe('FormScheduleModalComponent', () => {
  let component: FormScheduleModalComponent;
  let fixture: ComponentFixture<FormScheduleModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormScheduleModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormScheduleModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
