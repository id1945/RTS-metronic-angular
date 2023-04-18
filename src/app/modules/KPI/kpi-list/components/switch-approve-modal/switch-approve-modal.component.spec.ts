import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwitchApproveModalComponent } from './switch-approve-modal.component';

describe('SwitchApproveModalComponent', () => {
  let component: SwitchApproveModalComponent;
  let fixture: ComponentFixture<SwitchApproveModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SwitchApproveModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SwitchApproveModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
