import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveStationeryModalComponent } from './approve-stationery-modal.component';

describe('ApproveStationeryModalComponent', () => {
  let component: ApproveStationeryModalComponent;
  let fixture: ComponentFixture<ApproveStationeryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApproveStationeryModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveStationeryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
