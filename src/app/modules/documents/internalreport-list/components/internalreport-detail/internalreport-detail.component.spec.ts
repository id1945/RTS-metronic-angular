import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalReportDetailComponent } from './internalreport-detail.component';

describe('InternalReportDetailComponent', () => {
  let component: InternalReportDetailComponent;
  let fixture: ComponentFixture<InternalReportDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InternalReportDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalReportDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
