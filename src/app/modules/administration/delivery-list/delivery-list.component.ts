import { Options } from 'src/app/_metronic/shared/shared/models/options';
import { TranslateService } from '@ngx-translate/core';
import { ViewChild } from '@angular/core';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { of, BehaviorSubject } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import swal from 'sweetalert';
import { Router } from '@angular/router';
import { FormExpressDeliveryModalComponent } from './components/form-express-delivery-modal/form-express-delivery-modal.component';
import { TransportExpressDeliveryModalComponent } from './components/transport-express-delivery/transport-express-delivery-modal.component';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import { DataTable, Columns } from 'src/app/_metronic/shared/shared/models/dataTable';
import { deliveryList } from './models/delivery.model';

@Component({
  selector: 'app-delivery-list',
  templateUrl: './delivery-list.component.html',
  styleUrls: ['./delivery-list.component.scss']
})
export class DeliveryListComponent implements OnInit {
  public isSearchAdvance = false;
  public statusOptions: Options[] = [];
  public loaiOptions: Options[] = [];
  public donViVanChuyenOptions: Options[] = [];
  // Paginator
  public paginator = {
    pageSize: 20,
    page: 1,
    totalRecord: 0,
    sortField: 'hoSoId',
    sortOrder: 'desc',
    // List
    SearchText: '',
    LoaiDonKey: '',
    TrangThaiKey: '',
    donViVanChuyenKey :''
  };
  // Table
  public dataTable: DataTable<deliveryList> = {
    items: [],
    columns: [] as Columns[],
    selected: [],
  };

  @ViewChild('formExpressDelivery', { static: false }) formExpressDelivery: FormExpressDeliveryModalComponent;
  @ViewChild('formUpdateTranspost', { static: false }) formUpdateTranspost: TransportExpressDeliveryModalComponent;
  
  public search$ = new BehaviorSubject(null);

  constructor(
    private api: ApiService,
    private router: Router,
    private cdf: ChangeDetectorRef,
    private translate: TranslateService,
  ) {

    // Table config title and field
    this.dataTable.columns = [
      {
        field: 'maHoSo',
        sortField: 'NguoiNhan',
        title: 'Mã phiếu',
        width: '140px',
      },
      {
        field: 'tenNguoiTao',
        sortField: 'tenNguoiTao',
        title: 'Người tạo',
        width: '140px',
      },
      {
        field: 'tenPhongBanNguoiTao',
        sortField: 'tenPhongBanNguoiTao',
        title: 'Bộ phận',
        width: '140px',
      },
      {
        field: 'tenNguoiNhan',
        sortField: 'tenNguoiNhan',
        title: 'Người nhận',
        width: '140px',
      },
      {
        field: 'diaChiNguoiNhan',
        sortField: 'diaChiNguoiNhan',
        title: 'Địa chỉ người nhận',
        width: '140px',
      },
      {
        field: 'hinhThucChuyenDisplay',
        sortField: 'hinhThucChuyenDisplay',
        title: 'Hình thức chuyển',
        width: '140px',
      },
      {
        field: 'donViVanChuyenDisplay',
        sortField: 'donViVanChuyenDisplay',
        title: 'Đơn vị vận chuyển',
        width: '140px',
      },
      {
        field: 'maVanDon',
        sortField: 'maVanDon',
        title: 'Mã vận đơn',
        width: '140px',
      },
      {
        field: 'ngayCapNhanVanDon',
        sortField: 'ngayCapNhanVanDon',
        title: 'Ngày xác nhận',
        width: '140px',
      },
      {
        field: 'trangThaiDisplay',
        sortField: 'trangThaiDisplay',
        title: 'Trạng thái',
        width: '140px',
      },
      {
        field: 'thaoTac',
        title: 'Thao tác',
        width: '100px',
        align: 'center'
      }
    ];
  }

  
  ngOnInit(): void {
    this.getList();
    this.getTrangThaiOptions();
    this.getDonViVanChuyen();
    this.getTypeOptions();
    // Listen input search!
    this.search$.pipe(debounceTime(1000)).subscribe((res: string) => {
      if (res || res === '') {
        this.paginator.SearchText = res;
        this.getList();
      }
    })
  }

  /**
   * Sort
   * @param e 
   * @param field 
   */
  public sortOrderChange(e, field: string) {
    if (e != null) {
      this.paginator.sortField = field;
      this.paginator.sortOrder = e;
    } else {
      delete this.paginator.sortField;
      delete this.paginator.sortOrder;
    }
    this.dataTable.columns = this.dataTable.columns.map(m => (field == m.sortField ? { ...m, sortOrder: e } : { ...m, sortOrder: null }))
    this.getList();
  }

  /**
   * Get dataTable
   */
  public getList() {
    this.api.loadingCustomOn();
    
    const query = {
      ...this.paginator,
      page: this.paginator.page,
      ItemsPerPage: this.paginator?.pageSize,
      sortOrder: this.paginator?.sortOrder?.replace('end', '')
    };
    
    delete query.pageSize;
    delete query.totalRecord;

    this.api.get('/api/dangky-chuyephatnhanh-list', query).subscribe(res => {
      if (res) {
        this.dataTable = { ...this.dataTable, ...res }
        this.paginator = { ...this.paginator, totalRecord: res?.paging?.toTalRecord }
        this.cdf.detectChanges();
      }
      this.api.loadingCustomOff();
    }, err => this.api.loadingCustomOff())
  }

  /**
   * Get loại options
   */
  public getTypeOptions() {
    this.api.get('/api/dangky-chuyephatnhanh-danhmuc/hinh-thuc-chuyen')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.hinhThucChuyenKey, label: m.hinhThucChuyenDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.loaiOptions = res;
        }
      })
  }

  public async getDonViVanChuyen() {
    this.donViVanChuyenOptions = await this.api.get('/api/dangky-chuyephatnhanh-danhmuc/donvi-vanchuyen')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.donViVanChuyenKey, label: m.donViVanChuyenDisplay })))))
      .toPromise();
  }

  /**
   * Get danh muc options
   */
  public getTrangThaiOptions() {
    this.api.get('/api/dangky-chuyephatnhanh-danhmuc/trang-thai')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.trangThaiKey, label: m.trangThaiDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.statusOptions = res;
        }
      })
  }

  /**
   * Delete
   * @param id 
   */
  public onDelete(id) {
    this.api.delete(`/api/dangky-chuyephatnhanh-delete/${id}`)
      .subscribe((res: any) => {
        if (res?.isSuccess) {
          swal({
            icon: "success",
            title: "Xoá yêu cầu chuyển phát nhanh thành công!",
            buttons: {
              ok: this.translate.instant('COMMON.btn.close'),
            },
          } as any).then(() => {
            this.getList();
          });
        } else {
          this.api.errorMessage("Xoá yêu cầu chuyển phát nhanh không thành công!");
        }
      }, err => {
        this.api.errorMessage(err);
      });
  }

  public showDetail(item: any) {
    this.router.navigate(['contacts', 'institutional-detail', item?.vanBanDinhCheId]);
  }

}
