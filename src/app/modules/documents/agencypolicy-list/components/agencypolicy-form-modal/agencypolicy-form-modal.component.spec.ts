import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgencyPolicyFormModalComponent } from './agencypolicy-form-modal.component';

describe('AgencyPolicyFormModalComponent', () => {
  let component: AgencyPolicyFormModalComponent;
  let fixture: ComponentFixture<AgencyPolicyFormModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgencyPolicyFormModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgencyPolicyFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
