import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDriverModalComponent } from './form-driver-modal.component';

describe('FormDriverModalComponent', () => {
  let component: FormDriverModalComponent;
  let fixture: ComponentFixture<FormDriverModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormDriverModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormDriverModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
