import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthPlanListComponent } from './monthplan-list.component';

describe('MonthPlanListComponent', () => {
  let component: MonthPlanListComponent;
  let fixture: ComponentFixture<MonthPlanListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonthPlanListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthPlanListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
