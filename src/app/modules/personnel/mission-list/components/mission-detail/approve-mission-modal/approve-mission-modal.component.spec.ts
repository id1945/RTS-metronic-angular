import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveMissionModalComponent } from './approve-mission-modal.component';

describe('ApproveMissionModalComponent', () => {
  let component: ApproveMissionModalComponent;
  let fixture: ComponentFixture<ApproveMissionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApproveMissionModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveMissionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
