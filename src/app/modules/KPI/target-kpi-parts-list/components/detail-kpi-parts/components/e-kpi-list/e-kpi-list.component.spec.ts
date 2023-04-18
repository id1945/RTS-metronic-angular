import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EKpiListComponent } from './e-kpi-list.component';

describe('EKpiListComponent', () => {
  let component: EKpiListComponent;
  let fixture: ComponentFixture<EKpiListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EKpiListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EKpiListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
