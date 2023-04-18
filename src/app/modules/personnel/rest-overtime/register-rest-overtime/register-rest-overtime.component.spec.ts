import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterRestOvertimeComponent } from './register-rest-overtime.component';

describe('RegisterRestOvertimeComponent', () => {
  let component: RegisterRestOvertimeComponent;
  let fixture: ComponentFixture<RegisterRestOvertimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterRestOvertimeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterRestOvertimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
