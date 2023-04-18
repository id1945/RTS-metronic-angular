import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveParcelModalComponent } from './approve-parcel-modal.component';

describe('ApproveParcelModalComponent', () => {
  let component: ApproveParcelModalComponent;
  let fixture: ComponentFixture<ApproveParcelModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApproveParcelModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveParcelModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
