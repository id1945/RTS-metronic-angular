import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalReportFormModalComponent } from './internalreport-form-modal.component';

describe('InternalReportFormModalComponent', () => {
  let component: InternalReportFormModalComponent;
  let fixture: ComponentFixture<InternalReportFormModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InternalReportFormModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalReportFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
