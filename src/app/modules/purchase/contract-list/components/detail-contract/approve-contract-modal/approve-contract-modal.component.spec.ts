import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveContractModalComponent } from './approve-contract-modal.component';

describe('ApproveContractModalComponent', () => {
  let component: ApproveContractModalComponent;
  let fixture: ComponentFixture<ApproveContractModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApproveContractModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveContractModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
