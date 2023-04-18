import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarRegisterRestOvertimeComponent } from './calendar-register-rest-overtime.component';

describe('CalendarRegisterRestOvertimeComponent', () => {
  let component: CalendarRegisterRestOvertimeComponent;
  let fixture: ComponentFixture<CalendarRegisterRestOvertimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalendarRegisterRestOvertimeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarRegisterRestOvertimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
