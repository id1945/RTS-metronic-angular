import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibraryLawListComponent } from './librarylaw-list.component';

describe('LibraryLawListComponent', () => {
  let component: LibraryLawListComponent;
  let fixture: ComponentFixture<LibraryLawListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LibraryLawListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LibraryLawListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
