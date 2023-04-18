import { AfterViewInit, Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { pdfDefaultOptions } from 'ngx-extended-pdf-viewer';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';

interface ThuVienAnh {
  image: string;
  thumbImage: string;
  title: string;
  id: number;
}


@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss']
})
export class IntroComponent implements OnInit, AfterViewInit, OnDestroy {

  public isCollapsedPhoto = false;
  public isCollapsedVideo = false;
  public isCollapsedDocs = false;

  public urlPdf: string;
  public videoYoutube: any[] = [];
  public imageObject: ThuVienAnh[] = [];

  public ListTaiLieuTiengViet: any[] = [];
  public ListTaiLieuTiengAnh: any[] = [];

  public ListTinTuc: any[] = [];

  // Fake
  public videoID = 'xLKITY57pmc';

  constructor(
    public router: Router,
    private api: ApiService,
    public cdf: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.getThuVienAnh();
    this.getTaiLieuTiengViet();
    this.getTaiLieuTiengAnh();
    this.videoYoutube = [
      {
        id: '8ZNgE57h6dc',
        title: 'TOP HYUNDAI ACCENT 2021 - Kiến tạo lối đi riêng',
        content: 'Hyundai Accent 2021 phiên bản nâng cấp vừa Hyundai Thành Công giới thiệu trong thời gian vừa qua.'
      },
      {
        id: 'Hk7fiq3eJ_o',
        title: 'Giới thiệu & Trải nghiệm Hyundai KONA',
        content: 'Hyundai Kona – SUV năng động dành cho giới trẻ. Kể từ khi ra mắt thị trường Việt Nam vào năm 2018, Hyundai Kona là lựa chọn hàng đầu trong phân khúc ...'
      },
      {
        id: 'Hk7fiq3eJ_o',
        title: 'Hyundai Elantra 2019 – Tăng tốc tới tương lai',
        content: 'Hyundai Elantra 2019 là mẫu xe sedan hạng C có thiết kế sành điệu, nội thất tiện nghi và tích hợp nhiều công nghệ mới cho khả năng vận hành ...'
      },
      {
        id: '9F5kwJjjQtc',
        title: 'CHIẾN DỊCH NGÀY TRÁI ĐẤT CÙNG TC MOTOR HYUNDAI & BTS',
        content: 'Ngày trái đất (Earth day) là sự kiện nhằm nâng cao nhận thức và giá trị của môi ... CHIẾN DỊCH NGÀY TRÁI ĐẤT CÙNG TC MOTOR ...'
      },
      {
        id: '7XiHEcbtHTU',
        title: '[HYUNDAI KONA Thỏa khám phá] - Bài thi: Cung đường Huế - Đà Nẵng - Hội An',
        content: 'TC MOTOR đã tiến hành trao giải c cuộc thi “KONA - Thỏa khám phá” ... Huế - Đà Nẵng; An Giang miền Tây,… cùng Hyundai KONA cho ban tổ ..'
      },
      {
        id: '7XiHEcbtHTU',
        title: '[HYUNDAI KONA Thỏa khám phá] - Bài thi: Cung đường Quảng Bình - Quảng Trị',
        content: '“Thông qua cuộc thi Hyundai Kona - Thỏa Khám Phá, TC MOTOR mong muốn truyền đi cảm hứng về một phong cách sống luôn cống hiến hết mình theo ...'
      },
    ]
  }

  ngAfterViewInit(): void {
    pdfDefaultOptions.assetsFolder = 'bleeding-edge';
  }

  ngOnDestroy(): void {
  }


  public previewPdf(item: { taiLieuId: number, tenFile: string }) {
    const options = {
      observe: 'response',
      responseType: 'blob' as 'json',
    };
    this.api.get('/api/tailieu-misc/xem-tai-lieu', { taiLieuId: item?.taiLieuId }, options).subscribe(res => {
      if (res) {
        /* Get blob */
        const blob = new Blob([res.body], { type: 'application/pdf' });
        this.urlPdf = window.URL.createObjectURL(blob);
      }
    }, err => this.api.errorMessage(err));
  }

  public imageClick(item) {
    this.router.navigate(['/contacts', 'intro', 'gallery', item?.thuVienAnhCongTyId]);
  }

  public getThuVienAnh() {
    const query = {
      PageSize: 40,
      Page: 1,
      SortField: 'thuVienAnhCongTyId',
      SortOrder: 'desc',
      // List
      TenAlbumAnh: '',
      MoTa: '',
    }
    this.api.get('/api/thuvienanh-list', query).subscribe((res: any) => {
      if (res) {
        this.imageObject = res?.items?.map(m => ({...m, title: m?.moTa, url: m?.urlAnhDaiDien}));
        this.cdf.detectChanges();
      }
    });
  }

  public getTaiLieuTiengViet() {
    const query = {
      PageSize: 40,
      Page: 1,
      SortField: 'taiLieuId',
      SortOrder: 'desc',
      // List
      ngonNguKey: '1',
    }
    this.api.get('/api/tailieu-list', query).subscribe((res: any) => {
      if (res) {
        this.ListTaiLieuTiengViet = res?.items;
        if(res?.items.length > 0)
        {
          this.previewPdf(res.items[0]);
        }
        this.cdf.detectChanges();
      }
    });
  }


  public getTaiLieuTiengAnh() {
    const query = {
      PageSize: 40,
      Page: 1,
      SortField: 'taiLieuId',
      SortOrder: 'desc',
      // List
      ngonNguKey: '0',
    }
    this.api.get('/api/tailieu-list', query).subscribe((res: any) => {
      if (res) {
        this.ListTaiLieuTiengAnh = res?.items;
        this.cdf.detectChanges();
      }
    });
  }

}
