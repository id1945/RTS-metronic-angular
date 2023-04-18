import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingRoomModalComponent } from './meeting-room-modal.component';

describe('MeetingRoomModalComponent', () => {
  let component: MeetingRoomModalComponent;
  let fixture: ComponentFixture<MeetingRoomModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeetingRoomModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingRoomModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
