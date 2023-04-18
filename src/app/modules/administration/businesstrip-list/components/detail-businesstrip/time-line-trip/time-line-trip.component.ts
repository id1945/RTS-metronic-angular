import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';

export interface TimeLineChuyenDi {
  ghiChu: string;
  trangThai: string;
  thoiGian: string;
  nguoiDuyet: string;
  kmStart: string;
  kmEnd: string;
}

@Component({
  selector: 'app-time-line-trip',
  templateUrl: './time-line-trip.component.html',
  styleUrls: ['./time-line-trip.component.scss']
})
export class TimeLineTripComponent implements OnInit {

  @Input() data: TimeLineChuyenDi[];

  constructor() { }

  ngOnInit(): void {
  }

}
