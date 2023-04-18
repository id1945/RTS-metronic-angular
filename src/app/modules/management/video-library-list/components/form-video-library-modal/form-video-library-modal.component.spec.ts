import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormVideoLibraryModalComponent } from './form-video-library-modal.component';

describe('FormVideoLibraryModalComponent', () => {
  let component: FormVideoLibraryModalComponent;
  let fixture: ComponentFixture<FormVideoLibraryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormVideoLibraryModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormVideoLibraryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
