import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchApproveRestOvertimeComponent } from './search-approve-rest-overtime.component';

describe('SearchApproveRestOvertimeComponent', () => {
  let component: SearchApproveRestOvertimeComponent;
  let fixture: ComponentFixture<SearchApproveRestOvertimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchApproveRestOvertimeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchApproveRestOvertimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
