import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriterionKPIListComponent } from './criterion-kpi-list.component';

describe('CriterionKPIListComponent', () => {
  let component: CriterionKPIListComponent;
  let fixture: ComponentFixture<CriterionKPIListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CriterionKPIListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CriterionKPIListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
