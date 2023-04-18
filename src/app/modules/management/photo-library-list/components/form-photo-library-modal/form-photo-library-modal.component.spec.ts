import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPhotoLibraryModalComponent } from './form-photo-library-modal.component';

describe('FormPhotoLibraryModalComponent', () => {
  let component: FormPhotoLibraryModalComponent;
  let fixture: ComponentFixture<FormPhotoLibraryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormPhotoLibraryModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormPhotoLibraryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
