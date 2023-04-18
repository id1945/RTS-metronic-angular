import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageSliderComponent } from './image-slider/image-slider.component';
import { SwiperModule } from 'swiper/angular';
import { NzImageModule } from 'ng-zorro-antd/image';

@NgModule({
  declarations: [ImageSliderComponent],
  imports: [
    CommonModule,
    SwiperModule,
    NzImageModule
  ],
  exports: [ImageSliderComponent]
})
export class SliderModule { }
