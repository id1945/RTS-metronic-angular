import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTinyTargetModalComponent } from './edit-tiny-target-modal.component';

describe('EditTinyTargetModalComponent', () => {
  let component: EditTinyTargetModalComponent;
  let fixture: ComponentFixture<EditTinyTargetModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditTinyTargetModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTinyTargetModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
