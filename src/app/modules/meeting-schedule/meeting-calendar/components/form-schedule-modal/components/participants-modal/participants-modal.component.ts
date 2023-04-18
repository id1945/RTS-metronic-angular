import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import { DatePipe } from '@angular/common';

interface KiemTraLichHop {
  tenPhongHop: string,
  lichHop: {
    items: {
      congViecId: number,
      thoiGianBatDau: string,
      thoiGianKetThuc: string
    }[]
  }
}

@Component({
  selector: 'app-participants-modal',
  templateUrl: './participants-modal.component.html',
  styleUrls: ['./participants-modal.component.scss'],
  exportAs: 'participants'
})
export class ParticipantsModalComponent implements OnInit {

  @Input() formGroup: FormGroup;
  @Input() nhanViens: any[] = [];
  public isVisible = false;
  public kiemTraLichHop: KiemTraLichHop[] = [];

  constructor(
    private api: ApiService,
    public datepipe: DatePipe
  ) { }

  ngOnInit(): void {
  }

  public showModal() {
    this.validate();
  }

  get f() { return this.formGroup.controls; }

  private validate() {
    // Validate
    if (this.nhanViens.length === 0) {
      this.api.errorMessage('Chưa có người tham dự!');
      return false;
    } else if (this.f.ThoiGianBatDau.errors) {
      this.api.errorMessage('Thời gian bắt đầu là bắt buộc!');
      return false;
    } else if (this.f.ThoiGianKetThuc.errors) {
      this.api.errorMessage('Thời gian kết thúc là bắt buộc!');
      return false;
    } else {
      this.isVisible = true;
      this.getKiemTraLichHop();
    }
  }

  public getKiemTraLichHop() {
    const params = {
      ThoiGianBatDau: Math.floor(new Date(this.f.ThoiGianBatDau.value).getTime() / 1000),
      ThoiGianKetThuc: Math.floor(new Date(this.f.ThoiGianKetThuc.value).getTime() / 1000),
      NhanVienKeys: this.nhanViens?.map(m => m?.nhanVienKey),
      Page: 1,
      ItemsPerPage: 30,
    }
    this.api.post('/api/lich-lam-viec-list/kiem-tra-lich-hop', params).subscribe(res => {
      if (res) {
        this.kiemTraLichHop = res?.items;
      }
    })
  }

  public percentMod(items, i): number {
    if (i === 0) {
      const H = Number(this.datepipe.transform(items[i]?.thoiGianBatDau * 1000, 'HH'));
      const M = Number(this.datepipe.transform(items[i]?.thoiGianBatDau * 1000, 'mm'));
      const P = this.clacSec(H, M);
      return P;
    } else {
      const P = Math.floor((items[i]?.thoiGianBatDau - items[i - 1]?.thoiGianKetThuc) / 60 / 5.5);
      return P;
    }
  }

  public percentCurrent(item): number {
    const P = (item.thoiGianKetThuc - item.thoiGianBatDau) / 60 / 5.5;
    return P;
  }

  public clacSec(HOU, MIN): number {
    const calcMod = (percent: number) => {
      return percent + (MIN * 10) / 60; // Giờ hiện tại + % số phút dư
    }
    switch (HOU) {
      case 8:
        return calcMod(0);
      case 9:
        return calcMod(10);
      case 10:
        return calcMod(20);
      case 11:
        return calcMod(30);
      case 12:
        return calcMod(40);
      case 13:
        return calcMod(50);
      case 14:
        return calcMod(60);
      case 15:
        return calcMod(70);
      case 16:
        return calcMod(80);
      case 17:
        return calcMod(90);
      default:
        return 0;
    }
  }
}
