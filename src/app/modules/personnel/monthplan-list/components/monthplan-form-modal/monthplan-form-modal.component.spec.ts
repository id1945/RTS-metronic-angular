import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthPlanFormModalComponent } from './monthplan-form-modal.component';

describe('MonthPlanFormModalComponent', () => {
  let component: MonthPlanFormModalComponent;
  let fixture: ComponentFixture<MonthPlanFormModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonthPlanFormModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthPlanFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
