import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthPlanDetailComponent } from './monthplan-detail.component';

describe('MonthPlanDetailComponent', () => {
  let component: MonthPlanDetailComponent;
  let fixture: ComponentFixture<MonthPlanDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonthPlanDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthPlanDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
