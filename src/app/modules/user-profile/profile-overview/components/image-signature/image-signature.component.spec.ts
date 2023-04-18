import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageSignatureComponent } from './image-signature.component';

describe('ImageSignatureComponent', () => {
  let component: ImageSignatureComponent;
  let fixture: ComponentFixture<ImageSignatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageSignatureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageSignatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
