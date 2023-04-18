import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoLibraryListComponent } from './photo-library-list.component';

describe('PhotoLibraryListComponent', () => {
  let component: PhotoLibraryListComponent;
  let fixture: ComponentFixture<PhotoLibraryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhotoLibraryListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotoLibraryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
