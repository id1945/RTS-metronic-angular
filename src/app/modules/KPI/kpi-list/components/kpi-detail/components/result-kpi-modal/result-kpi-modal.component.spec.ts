import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultKpiModalComponent } from './result-kpi-modal.component';

describe('ResultKpiModalComponent', () => {
  let component: ResultKpiModalComponent;
  let fixture: ComponentFixture<ResultKpiModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResultKpiModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultKpiModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
