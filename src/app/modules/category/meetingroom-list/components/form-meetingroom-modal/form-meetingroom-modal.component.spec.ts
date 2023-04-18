import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormMeetingroomModalComponent } from './form-meetingroom-modal.component';

describe('FormMeetingroomModalComponent', () => {
  let component: FormMeetingroomModalComponent;
  let fixture: ComponentFixture<FormMeetingroomModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormMeetingroomModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormMeetingroomModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
