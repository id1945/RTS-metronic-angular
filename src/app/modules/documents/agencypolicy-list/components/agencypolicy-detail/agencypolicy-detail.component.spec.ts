import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgencyPolicyDetailComponent } from './agencypolicy-detail.component';

describe('AgencyPolicyDetailComponent', () => {
  let component: AgencyPolicyDetailComponent;
  let fixture: ComponentFixture<AgencyPolicyDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgencyPolicyDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgencyPolicyDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
