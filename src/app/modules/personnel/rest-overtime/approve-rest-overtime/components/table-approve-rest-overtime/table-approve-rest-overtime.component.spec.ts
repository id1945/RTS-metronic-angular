import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableApproveRestOvertimeComponent } from './table-approve-rest-overtime.component';

describe('TableApproveRestOvertimeComponent', () => {
  let component: TableApproveRestOvertimeComponent;
  let fixture: ComponentFixture<TableApproveRestOvertimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableApproveRestOvertimeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableApproveRestOvertimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
