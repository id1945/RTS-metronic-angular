import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDocumentsModalComponent } from './form-documents-modal.component';

describe('FormDocumentsModalComponent', () => {
  let component: FormDocumentsModalComponent;
  let fixture: ComponentFixture<FormDocumentsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormDocumentsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormDocumentsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
