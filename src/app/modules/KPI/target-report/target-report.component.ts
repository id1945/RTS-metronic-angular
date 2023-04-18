import { ApiService } from './../../../_metronic/shared/http/api.service';
import { Options } from 'src/app/_metronic/shared/shared/models/options';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Columns, DataTable } from 'src/app/_metronic/shared/shared/models/dataTable';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-target-report',
  templateUrl: './target-report.component.html',
  styleUrls: ['./target-report.component.scss']
})
export class TargetReportComponent implements OnInit {
  @ViewChild('table') table: ElementRef;
  // Paginator
  public paginator = {
    LoaiBieuMau: '',
    PhongBanKey: '',
    NamKey: '',
    QuyKey: '',
  };
  // 1. Mục tiêu bộ phận và đăng ký KPI
  public dataTable: DataTable<any> = {
    items: [],
    columns: [] as Columns[],
  };
  public dataTable2: DataTable<any> = {
    items: [],
    columns: [] as Columns[],
    columns2: [] as Columns[],
    columns3: [] as Columns[],
    columns4: [] as Columns[],
  };
  // 2. Báo cáo đánh giá hiệu quả hoàn thành công việc
  public dataTable3: DataTable<any> = {
    items: [],
    columns: [] as Columns[],
  };
  public dataTable4: DataTable<any> = {
    items: [],
    columns: [] as Columns[],
    columns2: [] as Columns[],
  };
  // 3. Tổng hợp kết quả đánh giá cấp bộ phận năm
  // 4. Tổng hợp KQDG-HQHT công việc cấp bộ phận toàn công ty
  public dataTable5: DataTable<any> = {
    items: [],
    columns: [] as Columns[],
    columns2: [] as Columns[],
    columns3: [] as Columns[],
  };

  public loaiBieuMauOptions: Options[] = [];
  public phongBanOptions: Options[] = [];
  public namOptions: Options[] = [];
  public quyOptions: Options[] = [];

  constructor(private api: ApiService) {
    this.setColumnMucTieuBoPhan();
    this.setColumnBaoCaoDanhGiaKQCV();
    this.setColumnTongHopKQ();
  }

  ngOnInit(): void {
    // Load options
    this.getloaiBieuMauOptions();
    this.getPhongBanOptions();
    this.getNamOptions();
    this.getQuyOptions();
  }

  /**
   *  1. Mục tiêu bộ phận và đăng kí KPI
   */
  public getListMucTieuBoPhanDangKy() {
    // Reset 
    this.dataTable.items = [];
    this.dataTable2.items = [];
    const query = {
      PhongBanKey: this.paginator?.PhongBanKey,
      NamKey: this.paginator?.NamKey,
    }
    this.api.get('/api/baocao-thongke-list/muc-tieu-bo-phan-va-dang-ky', query).subscribe(res => {
      if (res) {
        this.dataTable.items = res?.mucTieuTrongTam?.items;
        this.dataTable2.items = res?.chiTieuCongViec?.nhomTieuChiItems;
      }
      this.api.loadingCustomOff();
    }, err => {
      this.api.loadingCustomOff();
    })
  }

  /**
   *  2. Báo cáo đánh giá hiệu quả hoàn thành công việc
   */
  public getListDanhGiaHieuQuaHTCV() {
    // Reset
    this.dataTable3.items = [];
    this.dataTable4.items = [];
    const query = {
      PhongBanKey: this.paginator?.PhongBanKey,
      NamKey: this.paginator?.NamKey,
      QuyKey: this.paginator?.QuyKey,
    }
    this.api.get('/api/baocao-thongke-list/danh-gia-hieu-qua-hoan-thanh-cong-viec', query).subscribe(res => {
      if (res) {
        this.dataTable3.meta = res;
        this.dataTable3.items = res?.ketQuaThucHien?.kpiBoPhanItems;
        this.dataTable4.items = res?.chiTietDuLieu?.items;
        this.updateLabelTheoQuy();
      }
      this.api.loadingCustomOff();
    }, err => {
      this.api.loadingCustomOff();
    })
  }

  /**
   * 3. Tổng hợp kết quả đánh giá cấp bộ phận năm
   * 4. Tổng hợp KQDG-HQHT công việc cấp bộ phận toàn công ty
   */
  public getListTongHopKetQuaDanhGiaNam() {
    // Reset 
    this.dataTable5.items = [];
    const query = {
      PhongBanKey: this.paginator?.PhongBanKey,
      NamKey: this.paginator?.NamKey,
    }
    this.api.get('/api/baocao-thongke-list/tong-hop-ket-qua-danh-gia-nam', query).subscribe(res => {
      if (res) {
        this.dataTable5.meta = res;
        this.dataTable5.items = res?.items;
      }
      this.api.loadingCustomOff();
    }, err => {
      this.api.loadingCustomOff();
    })
  }

  public getloaiBieuMauOptions() {
    this.api.get('/api/baocao-thongke-dm/loai-bieu-mau')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.loaiBieuMauKey, label: m.loaiBieuMauDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.loaiBieuMauOptions = res;
        }
      })
  }

  public getPhongBanOptions() {
    this.api.get('/api/baocao-thongke-dm/phong-ban')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.phongBanKey, label: m.phongBanDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.phongBanOptions = res;
        }
      })
  }

  public getNamOptions() {
    this.api.get('/api/baocao-thongke-dm/nam')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.namKey, label: m.namDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.namOptions = res;
        }
      })
  }

  public getQuyOptions() {
    this.api.get('/api/baocao-thongke-dm/quy')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.quyKey, label: m.quyDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.quyOptions = res;
        }
      })
  }

  public getObjByKeyOptions(dataName: string, key: string) {
    return this[dataName]?.find(f => f?.value === key);
  }

  public export() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    /* save to file */
    const date = new Date();
    XLSX.writeFile(wb, `Báo cáo KPI_${this.getObjByKeyOptions('loaiBieuMauOptions', this.paginator.LoaiBieuMau).label}_${this.getObjByKeyOptions('phongBanOptions', this.paginator.PhongBanKey).label}_${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}.xlsx`);
  }

  /**
   * 1. Mục tiêu bộ phận và đăng ký KPI
   */
  private setColumnMucTieuBoPhan() {
    // Table A
    this.dataTable.columns = [
      {
        title: 'A',
        field: 'stt',
        width: '60px',
        className: 'bg-y',
        align: 'center'
      },
      {
        title: 'Mục tiêu trọng tâm của bộ phận',
        field: 'mucTieu',
        width: '500px',
        className: 'bg-y',
        align: 'left'
      },
    ]
    // Table B
    // Row 1 - 17: col (Dòng xen kẽ)
    this.dataTable2.columns = [
      {
        title: 'B',
        field: 'stt',
        width: '60px',
        className: 'bg-y',
        align: 'center',
        colspan: '1',
      },
      {
        title: 'Chỉ tiêu công việc của bộ phận (Chỉ tiêu KPI)',
        field: 'mucTieu',
        width: '500px',
        className: 'bg-y',
        align: 'left',
        colspan: '16'
      },
    ]
    // Row 2
    this.dataTable2.columns2 = [
      {
        title: 'STT',
        field: 'stt',
        width: '60px',
        className: 'bg-g',
        align: 'center',
        colspan: '1',
        rowspan: '3'
      },
      {
        title: 'Công việc chính',
        field: 'congViecChinh',
        width: '150px',
        className: 'bg-g',
        align: 'left',
        colspan: '1',
        rowspan: '3'
      },
      {
        title: 'Đăng ký KPI năm',
        field: 'dangKyKPINam',
        className: 'bg-gr',
        align: 'center',
        colspan: '5',
        rowspan: '1'
      },
      {
        title: 'Đăng chỉ tiêu kế hoạch năm',
        field: 'dangChiTieuKeHoachNam',
        width: '150px',
        className: 'bg-b',
        align: 'center',
        colspan: '7',
        rowspan: '1'
      },
      {
        title: 'Người thực hiện',
        field: 'nguoiThucHien',
        width: '150px',
        className: 'bg-g',
        align: 'left',
        colspan: '1',
        rowspan: '3'
      },
      {
        title: 'Ghi chú',
        field: 'ghiChu',
        width: '150px',
        className: 'bg-g',
        align: 'left',
        colspan: '1',
        rowspan: '3'
      },
    ]
    // Row 3
    this.dataTable2.columns3 = [
      {
        title: 'Tên KPI để đo lường hiệu quả công việc',
        field: 'tenKPI',
        width: '150px',
        className: 'bg-gr-1',
        align: 'left',
        colspan: '1',
        rowspan: '2',
        top: '95px'
      },
      {
        title: 'Công thức tính toán KPI',
        field: 'noiDungCongThuc',
        width: '150px',
        className: 'bg-gr-1',
        align: 'left',
        colspan: '1',
        rowspan: '2',
        top: '95px'
      },
      {
        title: 'Tỷ trọng KPI',
        field: 'trongSo',
        width: '150px',
        className: 'bg-gr-1',
        align: 'center',
        colspan: '1',
        rowspan: '2',
        top: '95px'
      },
      {
        title: 'Nguồn thông tin',
        field: 'nguonThongTin',
        width: '150px',
        className: 'bg-gr-1',
        align: 'center',
        colspan: '1',
        rowspan: '2',
        top: '95px'
      },
      {
        title: 'Thời gian',
        field: 'tanSuatTheoDoiDisplay',
        width: '150px',
        className: 'bg-gr-1',
        align: 'center',
        colspan: '1',
        rowspan: '2',
        top: '95px'
      },
      {
        title: 'Chỉ tiêu cần đăng ký tương ứng',
        field: 'chiTieuDangKy',
        width: '100px',
        className: 'bg-b',
        align: 'center',
        colspan: '1',
        rowspan: '2',
        top: '95px'
      },
      {
        title: 'Chỉ tiêu kế hoạch',
        width: '150px',
        className: 'bg-b',
        align: 'center',
        colspan: '6',
        rowspan: '1',
        top: '95px'
      },
    ]
    // Row 4
    this.dataTable2.columns4 = [
      {
        title: 'ĐVT',
        field: 'donViTinhDisplay',
        width: '80px',
        className: 'bg-b-1',
        align: 'center',
        colspan: '1',
        rowspan: '1',
        top: '142px'
      },
      {
        title: 'Cả năm',
        field: 'chiTieuCaNam',
        width: '80px',
        className: 'bg-b-1',
        align: 'center',
        colspan: '1',
        rowspan: '1',
        top: '142px'
      },
      {
        title: 'Quý I',
        field: 'quy1',
        width: '80px',
        className: 'bg-b-1',
        align: 'center',
        colspan: '1',
        rowspan: '1',
        top: '142px'
      },
      {
        title: 'Quý II',
        field: 'quy2',
        width: '80px',
        className: 'bg-b-1',
        align: 'center',
        colspan: '1',
        rowspan: '1',
        top: '142px'
      },
      {
        title: 'Quý II',
        field: 'quy3',
        width: '80px',
        className: 'bg-b-1',
        align: 'center',
        colspan: '1',
        rowspan: '1',
        top: '142px'
      },
      {
        title: 'Quý IV',
        field: 'quy4',
        width: '80px',
        className: 'bg-b-1',
        align: 'center',
        colspan: '1',
        rowspan: '1',
        top: '142px'
      },
    ]
  }

  /**
   * 2. Báo cáo đánh giá hiệu quả hoàn thành công việc
   */
  private setColumnBaoCaoDanhGiaKQCV() {
    // III. KẾT QUẢ THỰC HIỆN CHỈ TIÊU KPI CỦA BỘ PHẬN
    this.dataTable3.columns = [
      {
        title: 'STT',
        field: 'stt',
        width: '60px',
        className: 'bg-g',
        align: 'center'
      },
      {
        title: 'Mục tiêu',
        field: 'mucTieu',
        width: '200px',
        className: 'bg-g',
        align: 'left'
      },
      {
        title: 'Tên KPI',
        field: 'tenKPI',
        width: '200px',
        className: 'bg-g',
        align: 'left'
      },
      {
        title: 'Công thức tính',
        field: 'noiDungCongThuc',
        width: '200px',
        className: 'bg-g',
        align: 'left'
      },
      {
        title: 'Nhân sự CTN',
        field: 'nhanSuChiuTrachNhiemDisplay',
        width: '200px',
        className: 'bg-g',
        align: 'left'
      },
      {
        title: 'Đ.vị tính',
        field: 'donViTinhDisplay',
        width: '100px',
        className: 'bg-g',
        align: 'center'
      },
      {
        title: 'Loại KPI',
        field: 'loaiKPIDisplay',
        width: '150px',
        className: 'bg-g',
        align: 'center'
      },
      {
        title: 'Tần suất theo dõi',
        field: 'tanSuatTheoDoiDisplay',
        width: '150px',
        className: 'bg-g',
        align: 'center'
      },
      {
        title: 'Trọng số',
        field: 'trongSo',
        width: '100px',
        className: 'bg-g',
        align: 'center'
      },
      {
        title: 'Chỉ tiêu hoàn thành quý',
        field: 'chiTieuHoanThanh',
        width: '150px',
        className: 'bg-g',
        align: 'center'
      },
      {
        title: 'Thực tế hoàn thành chỉ tiêu KPI trong Quý',
        field: 'thucTeHoanThanh',
        width: '150px',
        className: 'bg-g',
        align: 'center'
      },
      {
        title: 'Tổng điểm KPI quý',
        field: 'tongDiem',
        width: '150px',
        className: 'bg-g',
        align: 'center'
      }
    ]
    // IV. CHI TIẾT DỮ LIỆU KẾT QUẢ HOÀN THÀNH CHỈ TIÊU KPI
    this.dataTable4.columns = [
      {
        field: 'stt',
        title: 'STT',
        width: '60px',
        rowspan: "2",
        colspan: "1",
        align: 'center',
        className: 'bg-g'
      },
      {
        field: 'mucTieu',
        title: 'Mục tiêu',
        width: '400px',
        rowspan: "2",
        colspan: "1",
        className: 'bg-g'
      },
      {
        field: 'tenKPI',
        title: 'Tên KPI',
        width: '400px',
        rowspan: "2",
        colspan: "1",
        className: 'bg-g'
      },
      {
        field: 'noiDungCongThuc',
        title: 'Công thức tính',
        width: '150px',
        rowspan: "2",
        colspan: "1",
        className: 'bg-g'
      },
      {
        field: 'nhanSuChiuTrachNhiemDisplays',
        title: 'Nhân sự CTN',
        width: '200px',
        rowspan: "2",
        colspan: "1",
        className: 'bg-g'
      },
      {
        field: 'donViTinhDisplay',
        title: 'Đ.vị tính',
        width: '80px',
        rowspan: "2",
        colspan: "1",
        align: 'center',
        className: 'bg-g'
      },
      {
        field: 'loaiKPIDisplay',
        title: 'Loại KPI',
        width: '150px',
        rowspan: "2",
        colspan: "1",
        align: 'center',
        className: 'bg-g'
      },
      {
        field: 'tanSuatTheoDoiDisplay',
        title: 'Tần suất theo dõi',
        width: '80px',
        rowspan: "2",
        colspan: "1",
        align: 'center',
        className: 'bg-g'
      },
      {
        field: 'thanhPhans',
        title: 'Thành phần',
        width: '400px',
        rowspan: "2",
        colspan: "1",
        className: 'bg-g'
      },
      {
        field: 'chiTieuHoanThanh',
        title: 'Chỉ tiêu hoàn thành quý',
        width: '150px',
        rowspan: "2",
        colspan: "1",
        align: 'center',
        className: 'bg-g'
      },
      {
        field: 'thucTeHoanThanhChiTieuQuy',
        title: 'Thực tế hoàn thành chỉ tiêu KPI trong quý',
        width: '150px',
        rowspan: "1",
        colspan: "4",
        align: 'center',
        className: 'bg-g'
      },
      {
        field: 'noiDungGiaiTrinh',
        title: 'Giải trình bộ phận',
        width: '200px',
        rowspan: "2",
        colspan: "1",
        className: 'bg-g'
      },
      {
        field: 'yKienKHCL',
        title: 'Ý kiến của bộ phận phận Kê hoạch-Chiến lược',
        width: '200px',
        rowspan: "2",
        colspan: "1",
        className: 'bg-g'
      }
    ];
    this.dataTable4.columns2 = [
      {
        field: 'giaTri1',
        title: 'Tháng 1',
        width: '100px',
        rowspan: "1",
        colspan: "1",
        className: 'bg-b',
        align: 'center',
        top: '95px'
      },
      {
        field: 'giaTri2',
        title: 'Tháng 2',
        width: '100px',
        rowspan: "1",
        colspan: "1",
        className: 'bg-b',
        align: 'center',
        top: '95px'
      },
      {
        field: 'giaTri3',
        title: 'Tháng 3',
        width: '100px',
        rowspan: "1",
        colspan: "1",
        className: 'bg-b',
        align: 'center',
        top: '95px'
      },
      {
        field: 'thucTeHoanThanh',
        title: 'Thực tế hoàn thành',
        width: '100px',
        rowspan: "1",
        colspan: "1",
        className: 'bg-b',
        align: 'center',
        top: '95px'
      },
    ];
  }

  public setColumnTongHopKQ() {
    this.dataTable5.columns = [
      {
        field: 'stt',
        title: 'STT',
        width: '60px',
        rowspan: "2",
        colspan: "1",
        className: 'bg-y',
        align: 'center',
        top: '100px'
      },
      {
        field: 'maPhongBan',
        title: 'Bộ phận',
        width: '150px',
        rowspan: "2",
        colspan: "1",
        className: 'bg-y',
        align: 'center',
        top: '100px'
      },
      {
        field: 'mucTieu',
        title: 'Mục tiêu',
        width: '300px',
        rowspan: "2",
        colspan: "1",
        className: 'bg-y',
        align: 'left',
        top: '100px'
      },
      {
        field: 'tenKPI',
        title: 'Tên KPI',
        width: '300px',
        rowspan: "2",
        colspan: "1",
        className: 'bg-y',
        align: 'left',
        top: '100px'
      },
      {
        field: 'nhanSuChiuTrachNhiemDisplay',
        title: 'Nhân sự CTN',
        width: '200px',
        rowspan: "2",
        colspan: "1",
        className: 'bg-y',
        align: 'left',
        top: '100px'
      },
      {
        field: 'trongSo',
        title: 'Trọng số',
        width: '100px',
        rowspan: "2",
        colspan: "1",
        className: 'bg-y',
        align: 'center',
        top: '100px'
      },
      {
        field: 'chiTieuHoanThanhQuy',
        title: 'Chỉ tiêu hoàn thành KPI',
        width: '100px',
        rowspan: "1",
        colspan: "4",
        className: 'bg-y',
        align: 'center',
        top: '100px'
      },
      {
        field: 'tyLeHoanThanhQuy',
        title: 'Tỷ lệ hoàn thành chỉ tiêu KPI',
        width: '100px',
        rowspan: "1",
        colspan: "4",
        className: 'bg-y',
        align: 'center',
        top: '100px'
      },
      {
        field: 'tongDiemQuy',
        title: 'Tổng điểm KPI',
        width: '100px',
        rowspan: "1",
        colspan: "4",
        className: 'bg-y',
        align: 'center',
        top: '100px'
      },
      {
        field: 'binhQuanKetQuaKPICaNam',
        title: 'Bình quân kết quả KPI cả năm',
        width: '200px',
        rowspan: "2",
        colspan: "1",
        className: 'bg-y',
        align: 'center',
        top: '100px'
      },
      {
        field: 'danhGia',
        title: 'Đánh giá',
        width: '200px',
        rowspan: "2",
        colspan: "1",
        className: 'bg-y',
        align: 'center',
        top: '100px'
      },
    ];
    this.dataTable5.columns2 = [
      // Col 1
      {
        title: 'Quý I',
        field: 'chiTieuHoanThanhQuy1',
        width: '100px',
        rowspan: "1",
        colspan: "1",
        className: 'bg-g',
        align: 'center'
      },
      {
        title: 'Quý II',
        field: 'chiTieuHoanThanhQuy2',
        width: '100px',
        rowspan: "1",
        colspan: "1",
        className: 'bg-g',
        align: 'center'
      },
      {
        title: 'Quý III',
        field: 'chiTieuHoanThanhQuy3',
        width: '100px',
        rowspan: "1",
        colspan: "1",
        className: 'bg-g',
        align: 'center'
      },
      {
        title: 'Quý IV',
        field: 'chiTieuHoanThanhQuy4',
        width: '100px',
        rowspan: "1",
        colspan: "1",
        className: 'bg-g',
        align: 'center'
      },
      // Col 2
      {
        title: 'Quý I',
        field: 'tyLeHoanThanhQuy1',
        width: '100px',
        rowspan: "1",
        colspan: "1",
        className: 'bg-b',
        align: 'center'
      },
      {
        title: 'Quý II',
        field: 'tyLeHoanThanhQuy2',
        width: '100px',
        rowspan: "1",
        colspan: "1",
        className: 'bg-b',
        align: 'center'
      },
      {
        title: 'Quý III',
        field: 'tyLeHoanThanhQuy3',
        width: '100px',
        rowspan: "1",
        colspan: "1",
        className: 'bg-b',
        align: 'center',
      },
      {
        title: 'Quý IV',
        field: 'tyLeHoanThanhQuy4',
        width: '100px',
        rowspan: "1",
        colspan: "1",
        className: 'bg-b',
        align: 'center'
      },
      // Col 3
      {
        title: 'Quý I',
        field: 'tongDiemQuy1',
        width: '100px',
        rowspan: "1",
        colspan: "1",
        className: 'bg-g',
        align: 'center'
      },
      {
        title: 'Quý II',
        field: 'tongDiemQuy2',
        width: '100px',
        rowspan: "1",
        colspan: "1",
        className: 'bg-g',
        align: 'center'
      },
      {
        title: 'Quý III',
        field: 'tongDiemQuy3',
        width: '100px',
        rowspan: "1",
        colspan: "1",
        className: 'bg-g',
        align: 'center'
      },
      {
        title: 'Quý IV',
        field: 'tongDiemQuy4',
        width: '100px',
        rowspan: "1",
        colspan: "1",
        className: 'bg-g',
        align: 'center'
      },
    ];
  }

  /**
   * Update label tháng
   * 2. Báo cáo đánh giá hiệu quả hoàn thành công việc
   */
  private updateLabelTheoQuy() {
    // 2. Báo cáo đánh giá hiệu quả hoàn thành công việc
    // Table 1
    this.dataTable3.columns = this.dataTable3.columns.map(m => {
      if (m?.field === 'chiTieuHoanThanh') {
        m.title = `Chỉ tiêu hoàn thành quý ${this.paginator?.QuyKey}`;
      }
      if (m?.field === 'thucTeHoanThanh') {
        m.title = `Thực tế hoàn thành chỉ tiêu KPI trong Quý ${this.paginator?.QuyKey}`;
      }
      if (m?.field === 'tongDiem') {
        m.title = `Tổng điểm KPI quý ${this.paginator?.QuyKey}`;
      }
      return m;
    });
    // Table 2
    const labelThang = (n1, n2, n3) => {
      this.dataTable4.columns2 = this.dataTable4.columns2.map(m => {
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
    switch (this.paginator?.QuyKey) {
      case 'I':
        labelThang(1, 2, 3);
        break;
      case 'II':
        labelThang(4, 5, 6);
        break;
      case 'III':
        labelThang(7, 8, 9);
        break;
      case 'IV':
        labelThang(10, 11, 12);
        break;
    }
    this.dataTable4.columns = this.dataTable4.columns.map(m => {
      if (m?.field === 'chiTieuHoanThanh') {
        m.title = `Chỉ tiêu hoàn thành quý ${this.paginator?.QuyKey}`;
      }
      if (m?.field === 'thucTeHoanThanhChiTieuQuy') {
        m.title = `Thực tế hoàn thành chỉ tiêu KPI trong quý ${this.paginator?.QuyKey}`;
      }
      return m;
    });
  }
}
