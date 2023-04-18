import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingScheduleCreatedComponent } from './meeting-schedule-created.component';

describe('MeetingScheduleCreatedComponent', () => {
  let component: MeetingScheduleCreatedComponent;
  let fixture: ComponentFixture<MeetingScheduleCreatedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeetingScheduleCreatedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingScheduleCreatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
