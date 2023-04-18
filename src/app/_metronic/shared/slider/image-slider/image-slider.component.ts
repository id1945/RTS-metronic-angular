import { Component, Input, ViewEncapsulation, EventEmitter, Output } from '@angular/core';
// import Swiper core and required modules
import SwiperCore, { Autoplay, EffectCoverflow, Pagination } from "swiper";
// install Swiper modules
SwiperCore.use([Autoplay, EffectCoverflow, Pagination]);

interface Images {
  title: string,
  url: string,
}

@Component({
  selector: 'app-image-slider',
  templateUrl: './image-slider.component.html',
  styleUrls: ['./image-slider.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ImageSliderComponent {

  @Input() images: any | Images;
  @Output() clickEvent = new EventEmitter();

  constructor() { }

  public onClick(item): void {
    this.clickEvent?.emit(item);
  }

}
