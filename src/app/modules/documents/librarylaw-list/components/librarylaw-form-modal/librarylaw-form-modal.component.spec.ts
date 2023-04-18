import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibraryLawFormModalComponent } from './librarylaw-form-modal.component';

describe('LibraryLawFormModalComponent', () => {
  let component: LibraryLawFormModalComponent;
  let fixture: ComponentFixture<LibraryLawFormModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LibraryLawFormModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LibraryLawFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
