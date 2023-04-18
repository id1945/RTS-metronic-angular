import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveRestOvertimeComponent } from './approve-rest-overtime.component';

describe('ApproveRestOvertimeComponent', () => {
  let component: ApproveRestOvertimeComponent;
  let fixture: ComponentFixture<ApproveRestOvertimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApproveRestOvertimeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveRestOvertimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
