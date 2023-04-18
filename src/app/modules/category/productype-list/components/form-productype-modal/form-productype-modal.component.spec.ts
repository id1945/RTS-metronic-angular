import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormProductypeModalComponent } from './form-productype-modal.component';

describe('FormProductypeModalComponent', () => {
  let component: FormProductypeModalComponent;
  let fixture: ComponentFixture<FormProductypeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormProductypeModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormProductypeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
