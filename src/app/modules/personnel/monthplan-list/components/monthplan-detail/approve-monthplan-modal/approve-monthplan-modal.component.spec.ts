import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveMonthPlanModalComponent } from './approve-monthplan-modal.component';

describe('ApproveMonthPlanModalComponent', () => {
  let component: ApproveMonthPlanModalComponent;
  let fixture: ComponentFixture<ApproveMonthPlanModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApproveMonthPlanModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveMonthPlanModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
