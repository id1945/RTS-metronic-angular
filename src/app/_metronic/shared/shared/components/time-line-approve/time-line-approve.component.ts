import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';

export interface TimeLine {
  ghiChu: string;
  tinhTrang: string;
  ngayDuyetStr: string;
  ngayDuyetNum: number;
  nguoiDuyet: string;
  tenTrangThai: string;
  tinhTrangKey: string;
  tenBuocThucHien: string;
  dinhKem?: {
    urlDownloadAll?: string,
    items: FileInfo[]
  },
  nguoiDuyets:any;
}

interface FileInfo {
  urlDownload: string,
  urlPreview: string,
  tenFile: string
}

@Component({
  selector: 'app-time-line-approve',
  templateUrl: './time-line-approve.component.html',
  styleUrls: ['./time-line-approve.component.scss']
})
export class TimeLineApproveComponent implements OnInit {

  @Input() data: TimeLine[];

  public isCollapsedFiles = false;

  constructor(private api: ApiService,   private router: Router,) { }
  

  ngOnInit(): void {
  }

  public showNguoiDung(Id) {
    var Url = `/contacts/personal-information/${Id}`;
    this.router.navigate([]).then((result) => {
      window.open(Url, '_blank');
    });
    // this.router.navigateByUrl(`/contacts/personal-information/${Id}`);
  }

  public download(item: FileInfo) {
    const header = {
      observe: 'response',
      responseType: 'blob' as 'json',
    };
    this.api.get(item?.urlDownload, null, header).subscribe(res => {
      this.api.downloadFileFromBlob(res);
    }, err => this.api.errorMessage(err));
  }

}
