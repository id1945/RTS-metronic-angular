import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CropImageComponent } from './crop-image/crop-image.component';
import { ImageCropperModule } from 'ngx-image-cropper';

@NgModule({
  declarations: [CropImageComponent],
  imports: [
    CommonModule,
    ImageCropperModule,
  ],
  exports: [
    CropImageComponent
  ]
})
export class CropImageModule { }
