import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import serialize from '@octetstream/object-to-form-data';
import swal from 'sweetalert';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import { CropImageComponent } from 'src/app/_metronic/shared/crop-image/crop-image/crop-image.component';

@Component({
  selector: 'app-image-signature',
  templateUrl: './image-signature.component.html',
  styleUrls: ['./image-signature.component.scss']
})
export class ImageSignatureComponent implements OnInit {

  @ViewChild('cropImage') cropImage: CropImageComponent;

  public fileData: any;
  public signatureUrl: string;

  constructor(
    private api: ApiService,
    private translate: TranslateService,
  ) { }

  ngOnInit(): void {
    this.getSignatureFile();
  }

  public onSubmit() {
    if (this.fileData) {
      this.api.post('/api/chukyso-create', serialize({ DataBase64: this.fileData?.base64 })).subscribe(res => {
        if (res?.isSuccess) {
          swal({
            icon: 'success',
            title: this.translate.instant('Upload ảnh thành công'),
            buttons: {
              ok: this.translate.instant('COMMON.btn.close'),
            },
          } as any).then(() => {
            this.cropImage.imageChangedEvent = null;
            this.getSignatureFile();
          });
        } else {
          this.api.errorMessage('Lỗi upload ảnh');
        }
      }, err => this.api.errorMessage(err))
    }
  }

  private getSignatureFile() {
    const header = {
      observe: 'response',
      responseType: 'blob' as 'json',
    };
    this.api.loadingCustomOn(); // Custom loading!
    this.api.get('/api/chukyso-misc/xem-chu-ky-cua-toi', null, header).subscribe(res => {
      let blob = new Blob([res.body], { type: res?.body?.type ?? 'image/png' });
      this.signatureUrl = window.URL.createObjectURL(blob);
      this.api.loadingCustomOff();
    }, err => {
      this.api.loadingCustomOff();
    })
  } 
}
