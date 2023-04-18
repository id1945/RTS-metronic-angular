import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { Options } from 'src/app/_metronic/shared/shared/models/options';
import { PaymentConfirmationModalComponent } from './components/payment-confirmation-modal/payment-confirmation-modal.component';
import { RequestsPaymentCreateModalComponent } from './components/requests-payment-create-modal/requests-payment-create-modal.component';
import { RequestsPayment, RequestsPaymentFiles, RequestsPaymentList } from './models/request-payment.model';
import { ImportFileTemplateComponent } from 'src/app/_metronic/shared/shared/components/import-file-template/import-file-template.component';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import { DataTable, Columns } from 'src/app/_metronic/shared/shared/models/dataTable';
import { TranslateService } from '@ngx-translate/core'

@Component({
  selector: 'app-requests-payment-list',
  templateUrl: './requests-payment-list.component.html',
  styleUrls: ['./requests-payment-list.component.scss']
})
export class RequestsPaymentListComponent implements OnInit {
  public isSearchAdvance = false;
  // Paginator
  public paginator = {
    pageSize: 20,
    page: 1,
    totalRecord: 0,
    SortField: 'hoSoId',
    SortOrder: 'desc',
    // List
    SearchText: '',
    SoChungTu: '',
    NgayTaoTu: null,
    NgayTaoDen: null,
    LoaiDeNghiKey: '',
    NhaCungCapKey: '',
    NgayKetThuc: '',
    UserNameNguoiYeuCau: '',
    TrangThaiThanhToanKey: '',
    TinhTrangKey: 'ChoPheDuyet',
  };
  public SearchText$ = new BehaviorSubject('');
  public SoChungTu$ = new BehaviorSubject(null);
  public UserNameNguoiYeuCau$ = new BehaviorSubject(null);
  // Table
  public dataTable: DataTable<RequestsPaymentList> = {
    items: [],
    columns: [] as Columns[],
    selected: [],
  };
  public nccOptions: Options[] = [];
  public statusTTOptions: Options[] = [];
  public statusStepsOptions: Options[] = [];
  public loaiDeNghiTTOptions: Options[] = [];

  @ViewChild('requestsPaymentCreate', { static: false }) requestsPaymentCreate: RequestsPaymentCreateModalComponent;
  @ViewChild('paymentConfirmation', { static: false }) paymentConfirmation: PaymentConfirmationModalComponent;
  @ViewChild('importFileTemplate', { static: false }) importFileTemplate: ImportFileTemplateComponent;

  // Checkbox print
  public setOfCheckedId = new Set<number>();

  constructor(
    private router: Router,
    private api: ApiService,
    private cdf: ChangeDetectorRef,
    private translate: TranslateService,
  ) {
    // Table config title and field
    this.dataTable.columns = [
      {
        field: 'checkbox',
        width: '50px',
        align: 'center'
      },
      {
        field: 'soChungTu',
        sortField: 'SoChungTu',
        title: this.translate.instant('PAYMENT.DETAIL.table.detail.voucherNumberLabel'),
        width: '180px',
      },
      {
        field: 'tenNguoiTao',
        sortField: 'NguoiDeNghi',
        title: this.translate.instant('PAYMENT.DETAIL.table.detail.proponentLabel'),
        width: '150px',
      },
      {
        field: 'tongTien',
        title: this.translate.instant('PAYMENT.DETAIL.table.detail.totalAmountLabel'),
        width: '150px',
        align: 'right'
      },
      {
        field: 'tongTienNgoaiTe',
        title: this.translate.instant('PAYMENT.DETAIL.table.detail.totalForeignLabel'),
        width: '150px',
        align: 'right'
      },
      {
        field: 'noiDung',
        title: this.translate.instant('PAYMENT.DETAIL.table.detail.contentLabel'),
        width: '150px',
      },
      {
        field: 'tenNhaCungCap',
        title: this.translate.instant('PAYMENT.DETAIL.table.detail.supplier'),
        width: '150px',
      },
      {
        field: 'tenBoPhan',
        title: this.translate.instant('PAYMENT.DETAIL.table.detail.departmentLabel'),
        width: '150px',
      },
      {
        field: 'ngayYeuCau',
        title: this.translate.instant('PAYMENT.DETAIL.table.detail.requestDateLabel'),
        width: '150px',
      },
      {
        field: 'tenTrangThai',
        title: this.translate.instant('PAYMENT.DETAIL.table.detail.statusLabel'),
        width: '150px',
      },
      {
        field: 'dinhKem',
        title: this.translate.instant('PAYMENT.DETAIL.table.detail.attachmentFiles'),
        width: '150px',
      },
      {
        field: 'ngayKetThuc',
        title: this.translate.instant('PAYMENT.DETAIL.table.detail.endDateLabel'),
        width: '150px',
      },
      {
        field: 'loaiThanhToan',
        title: this.translate.instant('PAYMENT.DETAIL.table.detail.paymentType'),
        width: '150px',
      },
      {
        field: 'soChungTuNoiBo',
        title: this.translate.instant('PAYMENT.LIST.table.internalNumberLabel'),
        width: '150px',
      },
      {
        field: 'ngayThanhToan',
        title: this.translate.instant('PAYMENT.DETAIL.table.detail.paymentDate'),
        width: '150px',
      },
      {
        field: 'thaoTac',
        title: this.translate.instant('PAYMENT.DETAIL.table.detail.manipulationLabel'),
        width: '70px',
      }
    ];
  }


  ngOnInit(): void {
    // Load datatable
    this.getList();
    this.getNCCOptions();
    this.getStatusTTOptions();
    this.getStatusStepOptions();
    this.getLoaiDeNghiTTOptions();
    // Listen input search!
    this.SearchText$.pipe(debounceTime(1000)).subscribe((res: any) => {
      if (res != null) {
        this.paginator.SearchText = res;
        this.getList();
      }
    });
    this.SoChungTu$.pipe(debounceTime(1000)).subscribe((res: any) => {
      if (res != null) {
        this.paginator.SoChungTu = res;
        this.getList();
      }
    });
    this.UserNameNguoiYeuCau$.pipe(debounceTime(1000)).subscribe((res: any) => {
      if (res != null) {
        this.paginator.UserNameNguoiYeuCau = res;
        this.getList();
      }
    });
  }

  public getList() {
    this.api.loadingCustomOn();

    let query = {
      ...this.paginator,
      Page: this.paginator.page,
      ItemsPerPage: this.paginator?.pageSize,
      SortOrder: this.paginator?.SortOrder?.replace('end', '')
    };

    delete query.page;
    delete query.pageSize;
    delete query.totalRecord;

    this.api.loadingCustomOn();
    this.api.get('/api/denghi-thanhtoan-daily-list', query).subscribe(res => {
      if (res) {
        this.dataTable.selected = [];
        this.dataTable = { ...this.dataTable, ...res };
        this.paginator = { ...this.paginator, totalRecord: res?.paging?.toTalRecord };
        this.dataTable.items = this.dataTable?.items?.map(m => ({ ...m, expand: false, checkbox: false }));
        this.cdf.detectChanges();
      }
      this.api.loadingCustomOff();
    }, err => {
      this.api.loadingCustomOff();
    })
  }

  public sortOrderChange(e, field: string) {
    if (e != null) {
      this.paginator.SortField = field;
      this.paginator.SortOrder = e;
    } else {
      delete this.paginator.SortField;
      delete this.paginator.SortOrder;
    }
    this.dataTable.columns = this.dataTable.columns.map(m => (field == m.field ? { ...m, sortOrder: e } : { ...m, sortOrder: null }))
    this.getList();
  }

  public getNCCOptions() {
    this.api.get('/api/denghi-thanhtoan-daily-dm/nha-cung-cap')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.nhaCungCapKey, label: m.nhaCungCapDisplay })))))
      .subscribe((res: Options[]) => {
        if (res) {
          this.nccOptions = res;
        }
      })
  }

  public getLoaiDeNghiTTOptions() {
    this.api.get('/api/denghi-thanhtoan-daily-dm/loai-de-nghi')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.loaiDeNghiKey, label: m.loaiDeNghiDisplay })))))
      .subscribe((res: Options[]) => {
        if (res) {
          this.loaiDeNghiTTOptions = res;
        }
      })
  }

  public getStatusTTOptions() {
    this.api.get('/api/denghi-thanhtoan-daily-dm/trang-thai-thanh-toan')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.trangThaiThanhToanKey, label: m.trangThaiThanhToanDisplay })))))
      .subscribe((res: Options[]) => {
        if (res) {
          this.statusTTOptions = res;
        }
      })
  }

  public getStatusStepOptions() {
    this.api.get('/api/denghi-thanhtoan-daily-dm/tinh-trang')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.tinhTrangKey, label: m.tinhTrangDisplay })))))
      .subscribe((res: Options[]) => {
        if (res) {
          this.statusStepsOptions = res;
        }
      })
  }

  public showDetail(item) {
    return this.router.navigate(['submissions', 'payment-detail', item?.hoSoId])
  }

  public showNewDetail(item) {
    return this.router.navigate(['submissions', 'payment-detail', item?.hoSoId])
  }

  public onChangeDateRange(e) {
    this.paginator.NgayTaoTu = ~~(new Date(e?.[0]).getTime()/1000);
    this.paginator.NgayTaoDen = ~~(new Date(e?.[1]).getTime()/1000);
    this.getList();
  }

  public onChangeDate(e) {
    this.paginator.NgayKetThuc = new Date(e).toISOString();
    this.getList();
  }

  public exportExcel() {
    const bodyParams = {
      searchText: this.paginator.SearchText,
      soChungTu: this.paginator.SoChungTu,
      ngayTaoTu: this.paginator.NgayTaoTu,
      ngayTaoDen: this.paginator.NgayTaoDen,
      loaiDeNghiKey: this.paginator.LoaiDeNghiKey,
      nhaCungCapKey: this.paginator.NhaCungCapKey,
      ngayKetThuc: this.paginator.NgayKetThuc,
      trangThaiThanhToanKey: this.paginator.TrangThaiThanhToanKey,
      tinhTrangKey: this.paginator.TinhTrangKey,
    }
    const header = {
      observe: 'response',
      responseType: 'blob' as 'json',
    };
    this.api.get('/api/denghi-thanhtoan-daily-list/export-excel', bodyParams, header).subscribe(res => {
      if (res) {
        this.api.downloadFileFromBlob(res);
      }
    }, err => {
      // Message error
      this.api.errorMessage(err);
    });
  }

  /**
   * DOWNLOAD
   * @param itemParent 
   * @param itemChild 
   */
  public donwloadById(itemParent: RequestsPayment, itemChild: RequestsPaymentFiles) {
    const header = {
      observe: 'response',
      responseType: 'blob' as 'json',
    };
    this.api.get('/api/denghi-thanhtoan-daily-misc/tai-lieu-goc', { hoSoGiayToId: itemChild?.hoSoGiayToId }, header).subscribe(res => {
      if (res) {
        this.api.downloadFileFromBlob(res);
      }
    }, err => {
      this.api.errorMessage(err);
    });
  }

  public donwloadAllById(item: RequestsPayment) {
    const header = {
      observe: 'response',
      responseType: 'blob' as 'json',
    };
    this.api.get('/api/denghi-thanhtoan-daily-misc/download-all', { hoSoId: item?.hoSoId }, header).subscribe(res => {
      if (res) {
        this.api.downloadFileFromBlob(res);
      }
    }, err => {
      this.api.errorMessage(err);
    });
  }

  public onPrint(hoSoId: number) {
    const header = {
      observe: 'response',
      responseType: 'blob' as 'json',
    };
    this.api.get('/api/denghi-thanhtoan-daily-detail/print', { HoSoId: hoSoId }, header).subscribe(res => {
      this.api.downloadFileFromBlob(res);
    }, err => {
      this.api.errorMessage(err);
    });
  }

  public onCheckboxAll(checked) {
    this.dataTable.items = this.dataTable.items?.map(m => ({ ...m, checkbox: checked }));
    this.onCheckbox();
  }

  public onCheckbox() {
    this.dataTable.selected = this.dataTable.items?.filter(m => m?.checkbox === true);
  }

  public onPrints() {
    if (this.dataTable.selected?.length) {
      const ids = this.dataTable.selected?.map(m => ({ HoSoIds: m?.hoSoId }))
      const header = {
        observe: 'response',
        responseType: 'blob' as 'json',
      };
      this.api.get('/api/denghi-thanhtoan-daily-detail/prints', ids, header).subscribe(res => {
        this.api.downloadFileFromBlob(res);
      }, err => {
        this.api.errorMessage(err);
      });
    } else {
      this.api.errorMessage('Chưa có bản ghi nào được chọn!');
    }
  }
}
