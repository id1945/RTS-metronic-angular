import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormUsersModalComponent } from './form-users-modal.component';

describe('FormUsersModalComponent', () => {
  let component: FormUsersModalComponent;
  let fixture: ComponentFixture<FormUsersModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormUsersModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormUsersModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
