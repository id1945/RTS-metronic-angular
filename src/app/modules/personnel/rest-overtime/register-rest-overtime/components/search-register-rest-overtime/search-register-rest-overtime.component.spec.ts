import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchRegisterRestOvertimeComponent } from './search-register-rest-overtime.component';

describe('SearchRegisterRestOvertimeComponent', () => {
  let component: SearchRegisterRestOvertimeComponent;
  let fixture: ComponentFixture<SearchRegisterRestOvertimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchRegisterRestOvertimeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchRegisterRestOvertimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
