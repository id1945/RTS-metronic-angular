import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibraryLawDetailComponent } from './librarylaw-detail.component';

describe('LibraryLawDetailComponent', () => {
  let component: LibraryLawDetailComponent;
  let fixture: ComponentFixture<LibraryLawDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LibraryLawDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LibraryLawDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
