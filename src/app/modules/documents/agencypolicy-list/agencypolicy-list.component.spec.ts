import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgencyPolicyListComponent } from './agencypolicy-list.component';

describe('AgencyPolicyListComponent', () => {
  let component: AgencyPolicyListComponent;
  let fixture: ComponentFixture<AgencyPolicyListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgencyPolicyListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgencyPolicyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
