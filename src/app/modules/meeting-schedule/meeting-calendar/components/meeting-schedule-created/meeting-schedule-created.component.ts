import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-meeting-schedule-created',
  templateUrl: './meeting-schedule-created.component.html',
  styleUrls: ['./meeting-schedule-created.component.scss'],
  exportAs: 'meeting-schedule'
})
export class MeetingScheduleCreatedComponent implements OnInit {

  @Output() loadList = new EventEmitter();
  @Output() edit = new EventEmitter();
  @Output() detail = new EventEmitter();

  public lichHopDaTao: any[] = [];

  constructor(
    private api: ApiService,
  ) { }

  ngOnInit(): void {
    this.getList();
  }

  public getList(date = new Date()) {

    const firstDay = new Date(date.getFullYear() - 5, date.getMonth(), 2);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 1);

    const params = {
      SearchText: '',
      ThoiGianBatDauTu: firstDay.toISOString(),
      ThoiGianBatDauDen: lastDay.toISOString(),
      Page: '1',
      ItemsPerPage: '30',
    };

    this.api.get('/api/lich-lam-viec-list/lich-hop-da-tao', params).subscribe(res => {
      if (res) {
        this.lichHopDaTao = res?.items
      }
    })
  }
}
