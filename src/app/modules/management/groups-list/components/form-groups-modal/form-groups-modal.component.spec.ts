import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormGroupsModalComponent } from './form-groups-modal.component';

describe('FormGroupsModalComponent', () => {
  let component: FormGroupsModalComponent;
  let fixture: ComponentFixture<FormGroupsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormGroupsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormGroupsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
