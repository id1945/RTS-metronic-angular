import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalReportListComponent } from './internalreport-list.component';

describe('InternalReportListComponent', () => {
  let component: InternalReportListComponent;
  let fixture: ComponentFixture<InternalReportListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InternalReportListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalReportListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
