import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';

import { NgbModal, NgbModule, ModalDismissReasons, NgbCarousel, NgbSlideEvent, NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
@Component({
  selector: 'app-ky-niem',
  templateUrl: './ky-niem.component.html',
  styleUrls: ['./ky-niem.component.scss']
})
export class KyNiemComponent implements OnInit {

  public ListNhanVien: any[] = [];
  array = [1, 2, 3, 4];
  effect = 'scrollx';

  @ViewChild('content') content;

  constructor(private modalService: NgbModal,
    public api: ApiService) {
  }

  openModal() {
    this.modalService.open(this.content, { centered: true });
  }
  ngOnInit(): void {
  }
  ngAfterViewInit() {
    this.loadNgayKyNiem();
  }
  public loadNgayKyNiem() {
    this.api.get('/api/trangchu/ky-niem')
      .subscribe((res: any) => {
        if (res.items.length > 0) {
          this.ListNhanVien = res?.items;
          this.openModal();
        }
      })
  }
}
