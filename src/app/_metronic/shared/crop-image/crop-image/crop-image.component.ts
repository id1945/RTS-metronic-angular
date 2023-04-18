import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';

interface OutputFile {
  base64: string;
  file: Blob
}

@Component({
  selector: 'app-crop-image',
  templateUrl: './crop-image.component.html',
  styleUrls: ['./crop-image.component.scss'],
  exportAs: 'crop-image'
})
export class CropImageComponent implements OnInit {

  public btnClassName = '';
  public btnSelectLable = 'Tải tài liệu lên';
  public btnCropLable = 'Cắt ảnh';
  public disabled = false;
  // Crop
  public imageChangedEvent: any = '';
  public croppedImage: any = '';
  public croppedImageOrigin: any = '';
  // Output
  @Output() base64 = new EventEmitter<OutputFile>();

  constructor() { }

  ngOnInit(): void {
  }

  public fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  public imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    // Base64 to blob
    fetch(this.croppedImage).then(res => res.blob()).then(res => {
      let blob = new Blob([res], { type: res?.type ?? 'image/png' });
      let file = new File([blob], `signature_${new Date().getTime()}.${res?.type?.replace('image/', '') ?? 'png'}`, { type: res?.type ?? 'image/png' })
      this.base64.emit({
        base64: this.croppedImage,
        file: file
      });
    })
  }

  public imageLoaded(image: LoadedImage) {
    // show cropper
  }

  public cropperReady() {
    // cropper ready
  }

  public loadImageFailed() {
    // show message
  }

  public onSubmit() {
    // show message
  }
}
