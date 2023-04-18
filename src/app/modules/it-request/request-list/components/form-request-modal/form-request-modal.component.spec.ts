import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormRequestModalComponent } from './form-request-modal.component';

describe('FormRequestModalComponent', () => {
  let component: FormRequestModalComponent;
  let fixture: ComponentFixture<FormRequestModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormRequestModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormRequestModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
