import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiFormModalComponent } from './kpi-form-modal.component';

describe('KpiFormModalComponent', () => {
  let component: KpiFormModalComponent;
  let fixture: ComponentFixture<KpiFormModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KpiFormModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KpiFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
