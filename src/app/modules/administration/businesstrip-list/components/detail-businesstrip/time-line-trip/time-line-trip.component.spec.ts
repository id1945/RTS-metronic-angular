import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeLineTripComponent } from './time-line-trip.component';

describe('TimeLineApproveComponent', () => {
  let component: TimeLineTripComponent;
  let fixture: ComponentFixture<TimeLineTripComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimeLineTripComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeLineTripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
