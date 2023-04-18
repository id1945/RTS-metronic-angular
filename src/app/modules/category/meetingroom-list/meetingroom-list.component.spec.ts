import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingroomListComponent } from './meetingroom-list.component';

describe('MeetingroomListComponent', () => {
  let component: MeetingroomListComponent;
  let fixture: ComponentFixture<MeetingroomListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeetingroomListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingroomListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
