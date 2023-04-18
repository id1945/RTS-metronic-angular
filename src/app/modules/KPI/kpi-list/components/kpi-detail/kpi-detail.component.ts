import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import { Columns, DataTable } from 'src/app/_metronic/shared/shared/models/dataTable';
import swal from 'sweetalert'
import serialize from '@octetstream/object-to-form-data';
import { ConfirmInputBasicComponent } from 'src/app/_metronic/shared/shared/components/confirm-input-basic/confirm-input-basic.component';
import { ConfirmInputFileComponent } from 'src/app/_metronic/shared/shared/components/confirm-input-file/confirm-input-file.component';
import { KpiQuyDetail, KpiQuyDetailLichSuPheDuyet } from '../../models/kpi-quy-detail.models';

@Component({
  selector: 'app-kpi-detail',
  templateUrl: './kpi-detail.component.html',
  styleUrls: ['./kpi-detail.component.scss']
})
export class KpiDetailComponent implements OnInit {

  @ViewChild('confirmAccept') confirmAccept: ConfirmInputBasicComponent;
  @ViewChild('confirmReject') confirmReject: ConfirmInputBasicComponent;
  @ViewChild('confirmInputFileKPIDetailApprove') confirmInputFileKPIDetailApprove: ConfirmInputFileComponent;
  @ViewChild('confirmInputFileKPIDetailReject') confirmInputFileKPIDetailReject: ConfirmInputFileComponent;

  /**
   * Chi Tiết Dữ Liệu Kết Quả Hoàn Thành Chỉ Tiêu KPI
   */
  public paginator = {
    pageSize: 20,
    page: 1,
    totalRecord: 0,
    SortField: 'id',
    SortOrder: 'desc',
    // List
    NamKey: '',
    QuyKey: '',
    PhongBanKey: '',
    TrangThaiKey: ''
  };
  // Table
  public dataTable: DataTable<KpiQuyDetail> = {
    items: [],
    columns: [] as Columns[],
    columns2: [] as Columns[],
    isActive: true
  };

  /**
   * Lịch sử phê duyệt
   */
  public paginator2 = {
    pageSize: 20,
    page: 1,
    totalRecord: 0,
    SortField: 'id',
    SortOrder: 'desc',
    // List
    NamKey: '',
    QuyKey: '',
    PhongBanKey: '',
    TrangThaiKey: ''
  };
  // Table
  public dataTable2: DataTable<KpiQuyDetailLichSuPheDuyet> = {
    items: [],
    columns: [] as Columns[],
  };

  public showHideColumnThucTeHoanThanhChiTieuQuy = true;
  public lichSuPheDuyet: KpiQuyDetailLichSuPheDuyet[] = [];
  public dataDetail: KpiQuyDetail;
  public kpiQuyId: string;

  constructor(
    private api: ApiService,
    private translate: TranslateService,
    private aRoute: ActivatedRoute
  ) {
    // Table config title and field
    this.dataTable.columns = [
      {
        field: 'stt',
        title: 'STT',
        width: '60px',
        rowspan: "2",
        colspan: "1",
        isActive: true,
        align: 'center'
      },
      {
        field: 'mucTieu',
        title: 'Mục tiêu',
        width: '400px',
        rowspan: "2",
        colspan: "1",
        isActive: true
      },
      {
        field: 'tenKPI',
        title: 'Tên KPI',
        width: '400px',
        rowspan: "2",
        colspan: "1",
        isActive: true
      },
      {
        field: 'noiDungCongThuc',
        title: 'Công thức tính',
        width: '300px',
        rowspan: "2",
        colspan: "1",
        isActive: true
      },
      {
        field: 'nhanSuChiuTrachNhiemDisplays',
        title: 'Nhân sự CTN',
        width: '200px',
        rowspan: "2",
        colspan: "1",
        isActive: true
      },
      {
        field: 'donViTinhDisplay',
        title: 'Đ.vị tính',
        width: '80px',
        rowspan: "2",
        colspan: "1",
        isActive: true,
        align: 'center'
      },
      {
        field: 'loaiKPIDisplay',
        title: 'Loại KPI',
        width: '150px',
        rowspan: "2",
        colspan: "1",
        isActive: true,
        align: 'center'
      },
      {
        field: 'tanSuatTheoDoiDisplay',
        title: 'Tần suất theo dõi',
        width: '80px',
        rowspan: "2",
        colspan: "1",
        isActive: true,
        align: 'center'
      },
      {
        field: 'thanhPhans',
        title: 'Thành phần',
        width: '400px',
        rowspan: "2",
        colspan: "1",
        isActive: true
      },
      {
        field: 'chiTieuHoanThanh',
        title: `Chỉ tiêu hoàn thành quý`,
        width: '100px',
        rowspan: "2",
        colspan: "1",
        isActive: true,
        align: 'center',
      },
      {
        field: 'thucTeHoanThanhChiTieuQuy',
        title: 'Thực tế hoàn thành chỉ tiêu KPI trong quý',
        width: '150px',
        rowspan: "1",
        colspan: "4",
        isActive: true,
        align: 'center',
        className: 'bg-note',
      },
      {
        field: 'noiDungGiaiTrinh',
        title: 'Giải trình bộ phận',
        width: '250px',
        rowspan: "2",
        colspan: "1",
        isActive: true
      },
      {
        field: 'raSoat',
        title: 'Rà soát',
        width: '80px',
        rowspan: "2",
        colspan: "1",
        isActive: true,
        align: 'center'
      },
      {
        field: 'yKienNguoiPheDuyet',
        title: 'Ý kiến người phê duyệt',
        width: '200px',
        rowspan: "2",
        colspan: "1",
        isActive: true
      },
    ];

    this.dataTable.columns2 = [
      {
        field: 'giaTri1',
        title: 'Tháng 1',
        width: '80px',
        rowspan: "1",
        colspan: "0",
        className: 'bg-note',
        isActive: true,
        align: 'center'
      },
      {
        field: 'giaTri2',
        title: 'Tháng 2',
        width: '80px',
        rowspan: "1",
        colspan: "0",
        className: 'bg-note',
        isActive: true,
        align: 'center'
      },
      {
        field: 'giaTri3',
        title: 'Tháng 3',
        width: '80px',
        rowspan: "1",
        colspan: "0",
        className: 'bg-note',
        isActive: true,
        align: 'center'
      },
      {
        field: 'thucTeHoanThanh',
        title: 'Thực tế hoàn thành',
        width: '80px',
        rowspan: "1",
        colspan: "0",
        className: 'bg-note',
        isActive: true,
        align: 'center'
      },
    ];

    // lichSuPheDuyet
    this.dataTable2.columns = [
      {
        field: 'stt',
        sortField: 'STT',
        title: 'STT',
        width: '60px',
        align: 'center'
      },
      {
        field: 'nguoiDuyet',
        sortField: 'nguoiDuyet',
        title: 'Người duyệt',
        width: '150px',
      },
      {
        field: 'noiDung',
        sortField: 'Ghi chú',
        title: 'Quý',
        width: '150px',
      },
      {
        field: 'tenTrangThai',
        sortField: 'tenTrangThai',
        title: 'Tên trạng thái',
        width: '150px',
      },
      {
        field: 'tinhTrang',
        sortField: 'tinhTrang',
        title: 'Tình trạng',
        width: '150px',
      },
      {
        field: 'ngayDuyet',
        sortField: 'ngayDuyet',
        title: 'Ngày duyệt',
        width: '150px',
        pipe: 'dd/MM/yyyy',
      }
    ];

    this.aRoute.params.subscribe(res => {
      if (res?.kpiQuyId) {
        this.kpiQuyId = res?.kpiQuyId;
        this.getDetailById(res?.kpiQuyId);
      }
    });
  }

  ngOnInit(): void {
  }

  public getDetailById(KPIQuyId): void {
    this.api.get('/api/kpiquy-detail', { KPIQuyId: KPIQuyId }).subscribe(res => {
      if (res) {
        this.dataDetail = res;
        this.dataTable.items = res?.items;
        this.lichSuPheDuyet = res?.lichSuPheDuyet?.items;
        this.updateLabelTheoQuy();
      }
    });
  }

  public updateKpiConfirm() {
    swal("Xác nhận? \n Bạn có muốn cập nhật KPI?", {
      buttons: ["Huỷ bỏ", "Xác nhận"],
    }).then(ok => {
      ok && this.kpiQuyId && this.api.post('/api/kpiquy-update/cap-nhat-ket-qua-kpi', { kpiQuyId: this.kpiQuyId }).subscribe(res => {
        swal({
          icon: 'success',
          title: 'Cập nhật KPI thành công!',
          buttons: {
            ok: this.translate.instant('COMMON.btn.close'),
          },
        }).then(() => {
          this.getDetailById(res?.kpiQuyId);
        });
      }, err => this.api.errorMessage(err));
    });
  }

  public onChangeShowHideColumn(item: Columns) {
    // Xoá cột thucTeHoanThanhChiTieuQuy && tất cả các cột nhỏ
    if (item.field === 'thucTeHoanThanhChiTieuQuy') {
      this.showHideColumnThucTeHoanThanhChiTieuQuy = item.isActive;
    }
  }

  private updateLabelTheoQuy() {
    const labelThang = (n1, n2, n3) => {
      this.dataTable.columns2 = this.dataTable.columns2.map(m => {
        if (m?.field === 'giaTri1') {
          m.title = `Tháng ${n1}`;
        }
        if (m?.field === 'giaTri2') {
          m.title = `Tháng ${n2}`;
        }
        if (m?.field === 'giaTri3') {
          m.title = `Tháng ${n3}`;
        }
        return m;
      });
    }
    switch (this.dataDetail?.quyDisplay?.toLowerCase()) {
      case 'i':
        labelThang(1, 2, 3);
        break;
      case 'ii':
        labelThang(4, 5, 6);
        break;
      case 'iii':
        labelThang(7, 8, 9);
        break;
      case 'iv':
        labelThang(10, 11, 12);
        break;
    }
    this.dataTable.columns = this.dataTable.columns.map(m => {
      if (m?.field === 'chiTieuHoanThanh') {
        m.title = `Chỉ tiêu hoàn thành quý ${this.dataDetail?.quyDisplay}`;
      }
      if (m?.field === 'thucTeHoanThanhChiTieuQuy') {
        m.title = `Thực tế hoàn thành chỉ tiêu KPI trong quý ${this.dataDetail?.quyDisplay}`;
      }
      return m;
    });
  }

  /**
   * Accept chi tiết
   * @param e 
   */
  public onSubmitAccept(e) {
    if (!e?.meta?.kpiQuyThanhPhanChiTietId) {
      this.api.errorMessage('Không tìm thấy kpiQuyThanhPhanChiTietId');
      return;
    }
    const params = {
      kpiQuyThanhPhanChiTietId: e?.meta?.kpiQuyThanhPhanChiTietId,
      noiDung: e?.content
    }
    this.api.post('/api/kpiquy-create/ra-soat-thuc-te-hoan-thanh-chi-tieu-phe-duyet', params).subscribe(res => {
      if (res?.isSuccess) {
        // Message ok
        swal({
          icon: 'success',
          title: 'Duyệt KPI thành phần chi tiết thành công!',
          buttons: {
            ok: this.translate.instant('COMMON.btn.close'),
          },
        } as any).then(() => {
          this.confirmAccept.isVisible = false;
          this.getDetailById(this.kpiQuyId);
        });
      } else {
        this.api.errorMessage('Duyệt KPI thành phần chi tiết không thành công!');
      }
    }, err => this.api.errorMessage(err));
  }

  /**
   * Reject chi tiết
   * @param e 
   */
  public onSubmitReject(e) {
    if (!e?.meta?.kpiQuyThanhPhanChiTietId) {
      this.api.errorMessage('Không tìm thấy kpiQuyThanhPhanChiTietId');
      return;
    }
    const params = {
      kpiQuyThanhPhanChiTietId: e?.meta?.kpiQuyThanhPhanChiTietId,
      noiDung: e?.content
    }
    this.api.post('/api/kpiquy-create/ra-soat-thuc-te-hoan-thanh-chi-tieu-tu-choi', params).subscribe(res => {
      if (res?.isSuccess) {
        // Message ok
        swal({
          icon: 'success',
          title: 'Báo cáo lại KPI quý thành công!',
          buttons: {
            ok: this.translate.instant('COMMON.btn.close'),
          },
        } as any).then(() => {
          this.confirmReject.isVisible = false;
          this.getDetailById(this.kpiQuyId);
        });
      } else {
        this.api.errorMessage('Báo cáo lại KPI quý không thành công!');
      }
    }, err => this.api.errorMessage(err));
  }

  /**
   * Approve KPI
   * @param e 
   */
  public onSubmitArroveKPI(e) {
    // FormData
    const formData = serialize({
      KPIQuyId: this.kpiQuyId,
      NoiDungXacNhan: e?.content
    });
    e?.selectedFiles?.forEach(f => formData.append('DinhKems', f?.file));
    // POST
    this.api.post('/api/kpiquy-create/phe-duyet', formData).subscribe(res => {
      if (res?.isSuccess) {
        // Message ok
        swal({
          icon: 'success',
          title: 'Duyệt KPI quý thành công!',
          buttons: {
            ok: this.translate.instant('COMMON.btn.close'),
          },
        } as any).then(() => {
          this.confirmInputFileKPIDetailApprove.isVisible = false;
          this.getDetailById(this.kpiQuyId);
        });
      } else {
        this.api.errorMessage('Duyệt KPI quý không thành công!');
      }
    }, err => this.api.errorMessage(err));
  }

  /**
   * Reject KPI
   * @param e 
   */
  public onSubmitRejectKPI(e) {
    // FormData
    const formData = serialize({
      KPIQuyId: this.kpiQuyId,
      NoiDungXacNhan: e?.content
    });
    e?.selectedFiles?.forEach(f => formData.append('DinhKems', f?.file));
    // POST
    this.api.post('/api/kpiquy-create/tu-choi', formData).subscribe(res => {
      if (res?.isSuccess) {
        // Message ok
        swal({
          icon: 'success',
          title: 'Từ chối KPI quý thành công!',
          buttons: {
            ok: this.translate.instant('COMMON.btn.close'),
          },
        } as any).then(() => {
          this.confirmInputFileKPIDetailReject.isVisible = false;
          this.getDetailById(this.kpiQuyId);
        });
      } else {
        this.api.errorMessage('Từ chối KPI quý không thành công!');
      }
    }, err => this.api.errorMessage(err));
  }

  /**
   * GET file
   * @param url 
   * @param fileName 
   */
  public downloadFile(url: string, fileName: string) {
    const header = {
      observe: 'response',
      responseType: 'blob' as 'json',
    };
    this.api.get(url, null, header).subscribe(res => {
      if (res) {
        this.api.downloadFileFromBlob(res);
      }
    }, err => {
      // Message error
      this.api.errorMessage(err);
    });
  }

  /**
   * Check color
   * @param data 
   * @returns 
   */
  public getMin(data) {
    return Math.min(...data?.thanhPhans?.map(m => Number(m?.trangThaiThanhPhanChiTietKey)));
  }
}