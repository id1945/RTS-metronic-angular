import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalMissionModalComponent } from './additional-mission-modal.component';

describe('AdditionalMissionModalComponent', () => {
  let component: AdditionalMissionModalComponent;
  let fixture: ComponentFixture<AdditionalMissionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdditionalMissionModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionalMissionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
