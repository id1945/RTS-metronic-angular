import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import { Columns, DataTable } from 'src/app/_metronic/shared/shared/models/dataTable';
import swal from 'sweetalert'
import serialize from '@octetstream/object-to-form-data';
import { SelectedFiles } from 'src/app/_metronic/shared/shared/services/files.service';
import { KpiDetail, KpiDetailUpdate } from './models/kpi-detail.model';
import { formatterInputNumber, nullOrNumberOnly, parserInputNumber } from 'src/app/_metronic/shared/shared/common/helper';
import { debounceTime } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-update-kpi-detail',
  templateUrl: './update-kpi-detail.component.html',
  styleUrls: ['./update-kpi-detail.component.scss']
})
export class UpdateKpiDetailComponent implements OnInit {

  // format input number
  public formatter = formatterInputNumber;
  public parser = parserInputNumber;

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
  public dataTable: DataTable<any> = {
    items: [],
    columns: [] as Columns[],
    columns2: [] as Columns[],
    isActive: true
  };

  public showHideColumnThucTeHoanThanhChiTieuQuy = true;
  public dataDetail: KpiDetail | KpiDetailUpdate;
  private kpiQuyId: number;
  public onAddAndEditThucTeHoanThanh$ = new BehaviorSubject(null);

  constructor(
    public api: ApiService,
    private router: Router,
    private aRoute: ActivatedRoute,
    private translate: TranslateService,
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
        title: 'Chỉ tiêu hoàn thành quý',
        width: '150px',
        rowspan: "2",
        colspan: "1",
        isActive: true,
        align: 'center'
      },
      {
        field: 'thucTeHoanThanhChiTieuQuy',
        title: 'Thực tế hoàn thành chỉ tiêu KPI trong quý',
        width: '150px',
        rowspan: "1",
        colspan: "4",
        isActive: true,
        align: 'center'
      },
      {
        field: 'noiDungGiaiTrinh',
        title: 'Giải trình bộ phận',
        width: '300px',
        rowspan: "2",
        colspan: "1",
        isActive: true
      },
      {
        field: 'thaoTac',
        title: 'Thao tác',
        width: '100px',
        rowspan: "2",
        colspan: "1",
        isActive: true,
        align: 'center'
      },
    ];

    this.dataTable.columns2 = [
      {
        field: 'giaTri1',
        title: 'Tháng 1',
        width: '100px',
        rowspan: "1",
        colspan: "0",
        className: 'bg-note',
        isActive: true,
        align: 'center'
      },
      {
        field: 'giaTri2',
        title: 'Tháng 2',
        width: '100px',
        rowspan: "1",
        colspan: "0",
        className: 'bg-note',
        isActive: true,
        align: 'center'
      },
      {
        field: 'giaTri3',
        title: 'Tháng 3',
        width: '100px',
        rowspan: "1",
        colspan: "0",
        className: 'bg-note',
        isActive: true,
        align: 'center'
      },
      {
        field: 'thucTeHoanThanh',
        title: 'Thực tế hoàn thành',
        width: '100px',
        rowspan: "1",
        colspan: "0",
        className: 'bg-note v-inline-middle',
        isActive: true,
        align: 'center'
      },
    ];

    this.aRoute.params.subscribe(res => {
      this.kpiQuyId = res?.kpiQuyId;
      // Thêm trongSo với màn hình update theo id
      res.kpiQuyId && this.dataTable.columns.splice(9, 0,
        {
          field: 'trongSo',
          title: 'Trọng sô',
          width: '150px',
          rowspan: "2",
          colspan: "1",
          isActive: true
        });
      this.getList();
    });
  }

  ngOnInit(): void {
    /**
     * Delay nhập giá trị 1,2,3 (input-number)
     * debounceTime
     */
    this.onAddAndEditThucTeHoanThanh$.pipe(debounceTime(1000)).subscribe((res: { kpiQuyChiTietId, e }) => {
      if (res) {
        const formData = {
          kpiQuyChiTietId: Number(res.kpiQuyChiTietId),
          kpiQuyThanhPhanChiTietId: Number(res.e?.kpiQuyThanhPhanChiTietId),
          thanhPhanKey: res.e?.thanhPhanKey,
          giaTri1: nullOrNumberOnly(res.e?.giaTri1),
          giaTri2: nullOrNumberOnly(res.e?.giaTri2),
          giaTri3: nullOrNumberOnly(res.e?.giaTri3),
        };
        // POST
        this.api.post('/api/kpiquy-update/thuc-te-hoan-thanh-chi-tieu', formData).subscribe(res => {
          if (res?.isSuccess) {
            this.getList();
          } else {
            this.api.errorMessage('Cập nhật dữ liệu không thành công!');
          }
        }, err => this.api.errorMessage(err));
      }
    });
  }

  private getList() {
    if (this.kpiQuyId) {
      // UPDATE by id
      this.getDetailById(this.kpiQuyId);
    } else {
      // UPDATE
      this.getDetail();
    }
  }

  public getDetail(): void {
    this.api.get('/api/kpiquy-update/cap-nhat-kpi-chi-tiet').subscribe(res => {
      if (res) {
        const inputUpdate = (m) => ({
          ...m?.noiDungGiaiTrinh,
          selectedFiles: [] as SelectedFiles[],
          noiDungGiaiTrinh: m?.noiDungGiaiTrinh?.noiDungGiaiTrinh ?? ''
        })
        this.dataTable.items = res?.items?.map(m => ({ ...m, noiDungGiaiTrinh: inputUpdate(m) })) ?? [];
        this.dataDetail = res as KpiDetailUpdate;
        this.updateLabelTheoQuy();
      }
    });
  }

  public getDetailById(KPIQuyId): void {
    this.api.get('/api/kpiquy-update', { KPIQuyId: KPIQuyId }).subscribe(res => {
      if (res) {
        const inputUpdate = (m) => ({
          ...m?.noiDungGiaiTrinh,
          selectedFiles: [] as SelectedFiles[],
          noiDungGiaiTrinh: m?.noiDungGiaiTrinh?.noiDungGiaiTrinh ?? ''
        });
        this.dataTable.items = res?.items?.map(m => ({ ...m, noiDungGiaiTrinh: inputUpdate(m), thanhPhans: [...m?.thanhPhans?.map(mTP => ({ ...mTP, isLock: false })) ?? []] })) ?? [];
        this.dataDetail = res as KpiDetail;
        this.updateLabelTheoQuy();
      }
    });
  }

  public updateKpiConfirm() {
    swal("Xác nhật thêm KPI Bổ sung?", {
      buttons: ["Huỷ bỏ", "Xác nhận"],
    }).then(ok => {
      ok && this.api.post('/api/kpiquy-create/them-kpi-bo-sung', { kpiQuyId: this.dataDetail.kpiQuyId }).subscribe(res => {
        if (res?.isSuccess) {
          swal({
            icon: "success",
            title: 'Thêm mới KPI bổ sung thành công!',
            buttons: {
              ok: this.translate.instant('COMMON.btn.close'),
            },
          } as any).then(() => {
          });
        } else {
          this.api.errorMessage('Thêm mới KPI bổ sung không thành công!');
        }
      }, err => this.api.errorMessage(err));
    });
  }

  /**
   * Show hide column Thực tế hoàn thành
   * @param item 
   */
  public onChangeShowHideColumn(item: Columns) {
    // Xoá cột thucTeHoanThanhChiTieuQuy && tất cả các cột nhỏ
    if (item.field === 'thucTeHoanThanhChiTieuQuy') {
      this.showHideColumnThucTeHoanThanhChiTieuQuy = item.isActive;
    }
  }

  /**
   * Update label tháng
   */
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
        m.title = `Chỉ tiêu hoàn thành quý ${this.dataDetail?.quyDisplay ?? ''}`;
      }
      if (m?.field === 'thucTeHoanThanhChiTieuQuy') {
        m.title = `Thực tế hoàn thành chỉ tiêu KPI trong quý ${this.dataDetail?.quyDisplay ?? ''}`;
      }
      return m;
    });
  }

  /**
   * Delete
   * @param id 
   */
  public onDeleteFile(KPIQuyChiTietId, FileName) {
    this.api.delete(`/api/kpiquy-delete/file-giai-trinh-bo-phan?KPIQuyChiTietId=${KPIQuyChiTietId}&FileName=${FileName}`).subscribe((res: any) => {
      if (res?.isSuccess) {
        swal({
          icon: "success",
          title: "Xoá file thành công!",
          buttons: {
            ok: this.translate.instant('COMMON.btn.close'),
          },
        } as any).then(() => {
          // load list
          this.getList();
        });
      } else {
        this.api.errorMessage("Xoá file không thành công!");
      }
    }, err => {
      this.api.errorMessage(err);
    });
  }

  /**
   * Trọng số
   * @param kpiQuyChiTietId 
   * @param e 
   */
  public onAddAndEditTrongSo(kpiQuyChiTietId, e) {
    const formData = {
      kpiQuyChiTietId: kpiQuyChiTietId,
      trongSo: e?.trongSo,
    };
    // POST
    this.api.post('/api/kpiquy-update/trong-so', formData).subscribe(res => {
      if (res?.isSuccess) {
        this.getList();
      } else {
        this.api.errorMessage('Cập nhật trọng số không thành công!');
      }
    }, err => this.api.errorMessage(err));
  }

  /**
   * Giải trình bộ phận
   * @param kpiQuyChiTietId 
   * @param e 
   */
  public onAddAndEditGiaiTrinhBoPhan(kpiQuyChiTietId, e) {
    const formData = serialize({
      KPIQuyChiTietId: kpiQuyChiTietId,
      NoiDungGiaiTrinh: e?.noiDungGiaiTrinh,
      DinhKems: []
    });
    // Append file
    e?.selectedFiles?.forEach(f => formData.append('DinhKems', f?.file));
    // POST
    this.api.post('/api/kpiquy-update/giai-trinh-bo-phan', formData).subscribe(res => {
      if (res?.isSuccess) {
        this.getList();
      } else {
        this.api.errorMessage('Cập nhật giải trình bộ phân không thành công!');
      }
    }, err => this.api.errorMessage(err));
  }

  public onLockUnlock(thanhPhan) {
    const isLockCurrent = thanhPhan?.trangThaiThanhPhanChiTietKey === '3';
    const params = {
      kpiQuyThanhPhanChiTietId: thanhPhan?.kpiQuyThanhPhanChiTietId,
      isLock: !isLockCurrent
    };
    thanhPhan?.kpiQuyThanhPhanChiTietId && this.api.post('/api/kpiquy-update/lock-unlock-thanh-phan-chi-tiet', params).subscribe(res => {
      if (res?.isSuccess) {
        swal({
          icon: "success",
          title: isLockCurrent ? 'Mở khoá thành công!' : 'Khoá thành công!',
          buttons: {
            ok: this.translate.instant('COMMON.btn.close'),
          },
        } as any).then(() => {
          this.getList();
        });
      } else {
        this.api.errorMessage(isLockCurrent ? 'Mở khoá không thành công!' : 'Khoá không thành công!',);
      }
    }, err => this.api.errorMessage(err));
  }

  /**
   * Duyệt thành phần chi tiết
   * @param e 
   */
  public onDuyetThanhPhan(e) {
    const params = {
      kpiQuyThanhPhanChiTietId: e?.kpiQuyThanhPhanChiTietId,
    };
    this.api.post('/api/kpiquy-create/duyet', params).subscribe(res => {
      if (res?.isSuccess) {
        swal({
          icon: "success",
          title: "Duyệt thành phần chi tiết thành công!",
          buttons: {
            ok: this.translate.instant('COMMON.btn.close'),
          },
        } as any).then(() => {
          this.getList();
        });
      } else {
        this.api.errorMessage('Duyệt thành phần chi tiết không thành công!');
      }
    }, err => this.api.errorMessage(err));
  }

  /**
   * Đề xuất
   */
  public onDeXuat() {
    // POST
    this.api.post('/api/kpiquy-create/de-xuat', { kpiQuyId: this.dataDetail.kpiQuyId }).subscribe(res => {
      if (res?.isSuccess) {
        swal({
          icon: "success",
          title: "Đề xuất thành công!",
          buttons: {
            ok: this.translate.instant('COMMON.btn.close'),
          },
        } as any).then(() => {
          this.router.navigate(['/', 'KPI', 'kpi']);
        });
      } else {
        this.api.errorMessage('Đề xuất không thành công!');
      }
    }, err => this.api.errorMessage(err));
  }

  /**
   * Khởi tạo
   */
  public onKhoiTao() {
    // POST
    this.api.post('/api/kpiquy-create/khoi-tao-kpi', { kpiQuyId: this.dataDetail.kpiQuyId }).subscribe(res => {
      if (res?.isSuccess) {
        swal({
          icon: "success",
          title: "Khởi tạo thành công!",
          buttons: {
            ok: this.translate.instant('COMMON.btn.close'),
          },
        } as any).then(() => {
          this.router.navigate(['/', 'KPI', 'kpi']);
        });
      } else {
        this.api.errorMessage('Khởi tạo không thành công!');
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

  /**
   * Chỉ load item bị thay đổi
   * @param index 
   * @returns 
   */
  public trackByFn(index: number) {
    return index;
  }
}
