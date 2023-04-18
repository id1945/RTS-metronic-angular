import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';

interface KiemTraPhongHop {
  phongHopId: number,
  soNguoiToiDa: number,
  tenPhongHop: string,
  congViec: {
    items: {
      congViecId: number,
      thoiGianBatDau: string,
      thoiGianKetThuc: string
    }[]
  }
}

interface RoomInfo {
  name: string;
  id: number;
}

@Component({
  selector: 'app-meeting-room-modal',
  templateUrl: './meeting-room-modal.component.html',
  styleUrls: ['./meeting-room-modal.component.scss'],
  exportAs: 'meeting-room'
})
export class MeetingRoomModalComponent implements OnInit {

  @Input() formGroup: FormGroup;
  @Output() phongHopEmit = new EventEmitter<RoomInfo>();

  public isVisible = false;
  public kiemTraPhongHop: KiemTraPhongHop[] = [];

  constructor(
    private api: ApiService,
    private datepipe: DatePipe,
    private message: NzMessageService
  ) { }

  ngOnInit(): void {
  }

  public showModal() {
    this.validate();
  }

  get f() { return this.formGroup.controls; }

  private validate() {
    // Validate
    if (this.f.SoLuong?.errors) {
      this.api.errorMessage('Số lượng người tham gia là bắt buộc!');
      return false;
    } else if (this.f.ThoiGianBatDau?.errors) {
      this.api.errorMessage('Thời gian bắt đầu là bắt buộc!');
      return false;
    } else if (this.f.ThoiGianKetThuc?.errors) {
      this.api.errorMessage('Thời gian kết thúc là bắt buộc!');
      return false;
    } else {
      this.isVisible = true;
      this.getKiemTraPhongHop();
    }
  }

  public getKiemTraPhongHop() {
    // Request GET
    const params = {
      SoLuong: this.formGroup.controls?.SoLuong?.value?.toString(),
      ThoiGianBatDau: Math.floor(new Date(this.f.ThoiGianBatDau.value).getTime() / 1000),
      ThoiGianKetThuc: Math.floor(new Date(this.f.ThoiGianKetThuc.value).getTime() / 1000),
      Page: 1,
      ItemsPerPage: 30,
    }
    this.api.post('/api/lich-lam-viec-list/kiem-tra-phong-hop', params).subscribe(res => {
      if (res) {
        this.kiemTraPhongHop = res?.items;
      }
    })
  }

  public percentMod(items, i): number {
    if (i === 0) {
      const H = Number(this.datepipe.transform(items[i]?.thoiGianBatDau * 1000, 'HH'));
      const M = Number(this.datepipe.transform(items[i]?.thoiGianBatDau * 1000, 'mm'));
      const P = this.calcSec(H, M);
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

  public calcSec(HOU, MIN): number {
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

  public onSelectRoom(item) {
    this.isVisible = false
    // Toast
    if (item?.congViec?.items?.length) {
      const FROM = this.datepipe.transform(item?.congViec?.items[0].thoiGianBatDau * 1000, 'dd-MM-yyyy HH:mm');
      const TO = this.datepipe.transform(item?.congViec?.items[item?.congViec?.items?.length - 1].thoiGianKetThuc * 1000, 'dd-MM-yyyy HH:mm');
      this.message.create('warning', `Từ ${FROM} đến ${TO} - ${item?.tenPhongHop} đã được sử dụng.`);
    }
    // Output data
    this.phongHopEmit.emit({
      id: item?.phongHopId,
      name: item?.tenPhongHop
    });
  }
}
