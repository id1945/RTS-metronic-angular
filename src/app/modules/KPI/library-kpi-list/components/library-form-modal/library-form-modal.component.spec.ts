import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibraryFormModalComponent } from './library-form-modal.component';

describe('LibraryFormModalComponent', () => {
  let component: LibraryFormModalComponent;
  let fixture: ComponentFixture<LibraryFormModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LibraryFormModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LibraryFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
