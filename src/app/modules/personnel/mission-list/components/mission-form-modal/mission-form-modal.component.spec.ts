import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissionFormModalComponent } from './mission-form-modal.component';

describe('MissionFormModalComponent', () => {
  let component: MissionFormModalComponent;
  let fixture: ComponentFixture<MissionFormModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MissionFormModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MissionFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
