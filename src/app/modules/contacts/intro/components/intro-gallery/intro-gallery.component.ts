import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

interface ThuVienAnh {
  thuVienAnhCongTyId: number;
  tenAlbumAnh: string;
  moTa: string;
  ghiChu: string;
  urlAnh: string;
  albumItems: {
    thuVienAnhCongTyId: number;
    tenAnh: string;
    moTa: string;
    urlAnh: string;
  }[]
}

@Component({
  selector: 'app-intro-gallery',
  templateUrl: './intro-gallery.component.html',
  styleUrls: ['./intro-gallery.component.scss']
})
export class IntroGalleryComponent implements OnInit {

  public thuVienAnh: ThuVienAnh;

  constructor(
    private api: ApiService,
    private aRouter: ActivatedRoute,
  ) {
    this.aRouter.params.subscribe(params => {
      if (params) {
        this.getDetail(params?.id);
      }
    })
  }

  ngOnInit(): void {
  }

  public getDetail(id) {
    this.api.get('/api/thuvienanh-detail', { ThuVienAnhCongTyId: id }).subscribe(res => {
      if (res) {
        this.thuVienAnh = res;
      }
    })
  }
}
