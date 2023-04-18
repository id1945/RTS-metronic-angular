import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntroGalleryComponent } from './intro-gallery.component';

describe('IntroGalleryComponent', () => {
  let component: IntroGalleryComponent;
  let fixture: ComponentFixture<IntroGalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntroGalleryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IntroGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
