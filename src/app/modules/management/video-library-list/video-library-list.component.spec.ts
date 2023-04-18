import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoLibraryListComponent } from './video-library-list.component';

describe('VideoLibraryListComponent', () => {
  let component: VideoLibraryListComponent;
  let fixture: ComponentFixture<VideoLibraryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideoLibraryListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoLibraryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
