import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPositionModalComponent } from './form-position-modal.component';

describe('FormPositionModalComponent', () => {
  let component: FormPositionModalComponent;
  let fixture: ComponentFixture<FormPositionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormPositionModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormPositionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
