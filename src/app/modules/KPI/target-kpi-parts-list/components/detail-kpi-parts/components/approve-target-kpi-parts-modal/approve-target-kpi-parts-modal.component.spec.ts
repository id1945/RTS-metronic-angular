import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveTargetKpiPartsModalComponent } from './approve-target-kpi-parts-modal.component';

describe('ApproveTargetKpiPartsModalComponent', () => {
  let component: ApproveTargetKpiPartsModalComponent;
  let fixture: ComponentFixture<ApproveTargetKpiPartsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApproveTargetKpiPartsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveTargetKpiPartsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
