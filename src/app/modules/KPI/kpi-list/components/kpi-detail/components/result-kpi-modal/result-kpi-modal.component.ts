import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import { Component, OnInit } from '@angular/core';
import { Columns, DataTable } from 'src/app/_metronic/shared/shared/models/dataTable';

@Component({
  selector: 'app-result-kpi-modal',
  templateUrl: './result-kpi-modal.component.html',
  styleUrls: ['./result-kpi-modal.component.scss'],
  exportAs: 'result-kpi'
})
export class ResultKpiModalComponent implements OnInit {

  public isVisible: boolean;
  // Table
  public dataTable: DataTable<any> = {
    items: [],
    columns: [] as Columns[],
  };

  public tongTrongSo = 0;
  public tongDiemQuy = 0;

  constructor(
    private api: ApiService
  ) { }

  ngOnInit(): void {
    // Table config title and field
    this.dataTable.columns = [
      {
        field: 'stt',
        title: 'STT',
        width: '60px',
        rowspan: "1",
        colspan: "1",
        isActive: true,
        align: 'center'
      },
      {
        field: 'mucTieu',
        title: 'Mục tiêu',
        width: '300px',
        rowspan: "1",
        colspan: "1",
        isActive: true
      },
      {
        field: 'tenKPI',
        title: 'Tên KPI',
        width: '300px',
        rowspan: "1",
        colspan: "1",
        isActive: true
      },
      {
        field: 'noiDungCongThuc',
        title: 'Công thức tính',
        width: '300px',
        rowspan: "1",
        colspan: "1",
        isActive: true
      },
      {
        field: 'nhanSuChiuTrachNhiemDisplays',
        title: 'Nhân sự CTN',
        width: '300px',
        rowspan: "1",
        colspan: "1",
        isActive: true
      },
      {
        field: 'donViTinhDisplay',
        title: 'Đơn vị tính',
        width: '150px',
        rowspan: "1",
        colspan: "1",
        isActive: true,
        align: 'center'
      },
      {
        field: 'loaiKPIDisplay',
        title: 'Loại KPI',
        width: '150px',
        rowspan: "1",
        colspan: "1",
        isActive: true,
        align: 'center'
      },
      {
        field: 'tanSuatTheoDoiDisplay',
        title: 'Tần suất theo dõi',
        width: '150px',
        rowspan: "1",
        colspan: "1",
        isActive: true,
        align: 'center'
      },
      {
        field: 'trongSo',
        title: 'Trọng số',
        width: '150px',
        rowspan: "1",
        colspan: "1",
        isActive: true,
        align: 'center'
      },
      {
        field: 'chiTieuHoanThanh',
        title: 'Chỉ tiêu hoàn thành quý',
        width: '150px',
        rowspan: "1",
        colspan: "1",
        isActive: true,
        align: 'center'
      },
      {
        field: 'thucTeHoanThanh',
        title: 'Thực tế hoàn thành chỉ tiêu KPI trong quý',
        width: '150px',
        rowspan: "1",
        colspan: "1",
        isActive: true,
        align: 'center'
      },
      {
        field: 'tongDiem',
        title: 'Tổng điểm KPI quý',
        width: '150px',
        rowspan: "1",
        colspan: "1",
        isActive: true,
        align: 'center'
      }
    ];
  }

  public showModal(kpiQuyId) {
    this.isVisible = true;
    this.getList(kpiQuyId)
  }

  public getList(kpiQuyId) {
    kpiQuyId && this.api.get('/api/kpiquy-detail/xem-ket-qua', { KPIQuyId: kpiQuyId }).subscribe(res => {
      if (res) {
        this.dataTable.items = res?.items;
        this.tongTrongSo = res?.trongSo;
        this.tongDiemQuy = res?.tongDiem;
      }
    })
  }
}
