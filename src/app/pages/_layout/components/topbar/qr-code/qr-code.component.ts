import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';

interface QRCode {
  code: string;
  url_link_ios: string;
  url_link_android: string;
}

@Component({
  selector: 'app-qr-code',
  templateUrl: './qr-code.component.html',
  styleUrls: ['./qr-code.component.scss']
})
export class QrCodeComponent implements OnInit {

  public code_data: QRCode;

  constructor(private api: ApiService) { }

  ngOnInit(): void {
  }

  public getLinkQRcode() {
    if (!this.code_data) {
      this.api.get('/htv_get_link_app/get_code_install_app').subscribe(res => {
        if (res?.result?.code_data?.length) {
          this.code_data = res?.result?.code_data[0];
        }
      }, err => this.api.errorMessage(err));
    }
  }
}