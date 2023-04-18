import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeLineApproveComponent } from './time-line-approve.component';

describe('TimeLineApproveComponent', () => {
  let component: TimeLineApproveComponent;
  let fixture: ComponentFixture<TimeLineApproveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimeLineApproveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeLineApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
