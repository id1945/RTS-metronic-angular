import { TranslateService } from '@ngx-translate/core';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { of, BehaviorSubject } from 'rxjs';
import { debounceTime, distinct, switchMap } from 'rxjs/operators';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import { formatterInputNumber, parserInputNumber, scrollEl } from 'src/app/_metronic/shared/shared/common/helper';
import swal from 'sweetalert';
import { Options } from 'src/app/_metronic/shared/shared/models/options';
import { ThongTinHangHoa } from '../../models/supplier-selection-form.model';

@Component({
  selector: 'app-form-supplier-selection-modal',
  templateUrl: './form-supplier-selection-modal.component.html',
  styleUrls: ['./form-supplier-selection-modal.component.scss'],
  exportAs: 'supplier-selection'
})
export class FormSupplierSelectionModalComponent implements OnInit {
  @Output() loadList = new EventEmitter;

  // format input number
  public formatter = formatterInputNumber;
  public parser = parserInputNumber;

  public isVisible = false;
  public step: number;
  public today = new Date();

  // Step 1
  public formGroup1: FormGroup;
  public hinhThucOptions: Options[] = [];
  public idYCMHOptions: Options[] = [];
  public toTrinhNoiBoOptions: Options[] = [];
  public searchIdYCMHDelay = new BehaviorSubject(null);
  public nguoiCanDuyetOptions: Options[] = [];
  public nguoiNhanThongBaoOptions: Options[] = [];

  // Step 2
  public formGroup2: FormGroup;
  public formGroup3: FormGroup;
  public ketQuaLCNCC: any[] = [1];
  public isFormKetQua = false;
  public hangHoaOptions: Options[] = [];
  public nhaCungCapOptions: Options[] = [];
  public dataTableStep2: ThongTinHangHoa[] = [];

  constructor(
    private api: ApiService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.initForm1();
    this.initForm2();
    this.initForm3();
  }

  public showModal(data?, mode?: string) {
    this.step = 1;
    this.isVisible = true;
    this.ngOnInit();
    // Load options
    this.getHinhThucOptions();
    this.getIdYCMHOptions();
    this.getToTrinhNoiBoOptions();
    this.getHangHoaOptions();
    this.getNhaCungCapOptions();
    this.getNguoiCanDuyetOptions();
    this.getNguoiNhanThongBaoOptions();
  }

  private initForm1() {
    this.formGroup1 = new FormGroup({
      hinhThucKey: new FormControl(null, Validators.required),
      ngayLap: new FormControl(''),
      idYCMHs: new FormControl(null),
      toTrinhNoiBoKeys: new FormControl(null),
      isBoPhanTuMua: new FormControl(false),
      nguoiCanDuyetKeys: new FormControl(null, Validators.required),
      nguoiNhanThongBaoKeys: new FormControl(null),
      noiDung: new FormControl(''),
    })
  }

  private initForm2() {
    this.formGroup2 = new FormGroup({
      nhaCungCapKey: new FormControl(null, Validators.required),
      hangHoaKey: new FormControl(null, Validators.required),
      quyCach: new FormControl(''),
      dvt: new FormControl(''),
      soLuong: new FormControl(0, Validators.required),
      donGiaChuaVAT: new FormControl(0, Validators.required),
      thanhTienChuaVAT: new FormControl(0),
      ghiChu: new FormControl(''),
    });
    // onChange events
    this.f2.hangHoaKey.valueChanges.subscribe(hangHoaKey => this.f2.dvt.setValue(this.getObjOptions('hangHoaOptions', hangHoaKey)?.meta?.dvt ?? ''));
    this.f2.hangHoaKey.valueChanges.subscribe(hangHoaKey => this.f2.donGiaChuaVAT.setValue(this.getObjOptions('hangHoaOptions', hangHoaKey)?.meta?.giaThamKhao ?? 0));
    this.f2.soLuong.valueChanges.subscribe(soLuong => this.f2.thanhTienChuaVAT.setValue(soLuong * this.f2.donGiaChuaVAT.value));
    this.f2.donGiaChuaVAT.valueChanges.subscribe(donGiaChuaVAT => this.f2.thanhTienChuaVAT.setValue(this.f2.soLuong.value * donGiaChuaVAT));
  }

  private initForm3() {
    this.formGroup3 = new FormGroup({
      vat: new FormControl(0, Validators.required),
      giamGia: new FormControl(0, Validators.required),
    })
  }

  get f1() { return this.formGroup1.controls; }
  get f2() { return this.formGroup2.controls; }
  get f3() { return this.formGroup3.controls; }

  public onThemThongTin(scollEl: HTMLElement) {
    scrollEl(scollEl, 500);
    this.formGroup2.markAllAsTouched();
    if (this.formGroup2.valid) {
      this.dataTableStep2.push(this.formGroup2.value);
      this.isFormKetQua = false;
      this.initForm2();
    }
  }

  public onCreate() {
    if (this.formGroup1.valid && this.dataTableStep2.length && this.formGroup3.valid) {
      const body = {
        ...this.formGroup1.value,
        ...this.formGroup3.value,
        ngayLap: Math.floor(new Date(this.f1.ngayLap.value).getTime() / 1000),
        nhaCungCaps: this.dataTableStep2.map(m => { 
          delete m.dvt; 
          return m; 
        })
      }
      this.api.post('/api/purchase-requisition-create', body).subscribe(res => {
        if (res?.isSuccess) {
          swal({
            icon: 'success',
            title: `Thêm đề xuất lựa chọn nhà cung cấp thành công!`,
            buttons: {
              ok: this.translate.instant('COMMON.btn.close'),
            },
          } as any).then(() => {
            this.isVisible = false;
            this.loadList.emit();
          });
        } else {
          this.api.errorMessage('Thêm đề xuất lựa chọn nhà cung cấp không thành công!');
        }
      }, err => this.api.errorMessage(err));
    }
  }

  private getHinhThucOptions() {
    this.api.get('/api/purchase-requisition-dm/hinh-thuc')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.hinhThucKey, label: m.hinhThucDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.hinhThucOptions = res;
        }
      })
  }

  private getIdYCMHOptions() {
    this.searchIdYCMHDelay.pipe(debounceTime(1000)).subscribe((text) => {
      const query = {
        SearchText: text,
        SortField: 'NgayTao',
        SortOrder: 'asc',
        Page: 1,
        ItemsPerPage: 20
      }
      this.api.get('/api/purchase-product-list', query)
        .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.id, label: m.maThamChieu, meta: m })))))
        .subscribe((res: any) => {
          if (res) {
            this.idYCMHOptions = res;
          }
        });
    });
  }

  private getToTrinhNoiBoOptions() {
    const query = {
      SortField: 'NgayTao',
      SortOrder: 'desc'
    }
    this.api.get('/api/totrinh-duyetchi-list/noi-bo', query)
      .pipe(
        switchMap(s => of(s?.items?.map((m: any) => ({ value: m.hoSoId.toString(), label: m.maToTrinh })))),
        distinct((p: Options) => p.value))
      .subscribe((res: any) => {
        if (res) {
          this.toTrinhNoiBoOptions = res;
        }
      })
  }

  private getNhaCungCapOptions() {
    this.api.get('/api/purchase-danh-muc/nha-cung-cap')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.nhaCungCapKey, label: m.nhaCungCapDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.nhaCungCapOptions = res;
        }
      })
  }

  private getHangHoaOptions() {
    this.api.get('/api/purchase-danh-muc/hang-hoa')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.hangHoaKey, label: m.hangHoaDisplay, meta: m })))))
      .subscribe((res: any) => {
        if (res) {
          this.hangHoaOptions = res;
        }
      })
  }

  private getNguoiCanDuyetOptions() {
    this.api.get('/api/purchase-contract-dm/nguoi-can-duyet')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.nguoiCanDuyetKey, label: m.nguoiCanDuyetDisplay, meta: m })))))
      .subscribe((res: any) => {
        if (res) {
          this.nguoiCanDuyetOptions = res;
        }
      })
  }

  private getNguoiNhanThongBaoOptions() {
    this.api.get('/api/purchase-contract-dm/nguoi-nhan-thong-bao')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.nguoiNhanThongBaoKey, label: m.nguoiNhanThongBaoDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.nguoiNhanThongBaoOptions = res;
        }
      })
  }

  public onDelete(i: number) {
    this.dataTableStep2 = this.dataTableStep2.filter((f, idx) => idx !== i);
  }

  /**
  * Get option by key
  * @param optionName 
  * @param key 
  * @returns 
  */
  public getObjOptions(optionName: string, key: string | string[] | number[]) {
    if (typeof key === 'string') {
      return this[optionName].find(f => f.value === key);
    }
    if (key instanceof Array) {
      return this[optionName].filter(f => !!(key as []).find(k => f.value === k))?.map(m => m.label);;
    }
  }

  get tongChuaVAT() {
    return [...this.dataTableStep2]?.map(m => m.thanhTienChuaVAT)?.reduce((total: number, currentValue: number) => (total + currentValue), 0) ?? 0;
  }

  get tongDaCoVAT() {
    return (this.tongChuaVAT - this.f3.giamGia.value - this.f3.vat.value) ?? 0;
  }

  public nextStep(index) {
    // Touched form
    if (index === 2 && this.formGroup1.invalid) {
      this.formGroup1.markAllAsTouched();
      return;
    }
    if (index === 3 && (this.formGroup1.invalid || this.ketQuaLCNCC?.length === 0 || this.formGroup3.invalid)) {
      this.formGroup3.markAllAsTouched();
      return;
    }
    if (index) {
      this.step = index; // Next
    } else {
      this.step += 1; // Next ++
    }
  }

  public prevStep() {
    this.step -= 1;
  }

}
