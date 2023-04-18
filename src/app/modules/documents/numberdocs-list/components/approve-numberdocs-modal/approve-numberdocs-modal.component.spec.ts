import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveNumberdocsModalComponent } from './approve-numberdocs-modal.component';

describe('ApproveMissionModalComponent', () => {
  let component: ApproveNumberdocsModalComponent;
  let fixture: ComponentFixture<ApproveNumberdocsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApproveNumberdocsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveNumberdocsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
