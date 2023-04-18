import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { differenceInCalendarDays } from 'date-fns';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import { Options } from 'src/app/_metronic/shared/shared/models/options';
import swal from 'sweetalert';

@Component({
  selector: 'app-form-registervehicle-modal',
  templateUrl: './form-registervehicle-modal.component.html',
  styleUrls: ['./form-registervehicle-modal.component.scss']
})
export class RegisterVehicleModalComponent implements OnInit {

  @Output() loadList = new EventEmitter;
  @Input() public isVisible = false;

  public isSubmit: boolean;

  public step: number;
  public today = new Date();

  // Step 1
  public formGroup1: FormGroup;
  // Step 2
  public formGroup2: FormGroup;

  // Step 2
  public selectedFiles: any[] = [];

  // Step 3
  public partSelected: any;
  public partOptions: Options[] = [];
  public fullnameSelected: any;
  public fullnameOptions: Options[] = [];
  public dongTrinhDS: any[] = [];

  public khuVucOptions: Options[] = [];
  public dieuDongCongTacOptions: Options[] = [];
  public tinhThanhOptions: Options[] = [];
  public quanHuyenOptions: Options[] = [];
  public loaiXeOptions: Options[] = [];
  public hinhThucLaiXeOptions: Options[] = [];

  public disabledDate = (current: Date): boolean => differenceInCalendarDays(current, new Date()) < 0;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private cdf: ChangeDetectorRef,
    private translate: TranslateService,
  ) {
  }

  ngOnInit() {
    this.initFormStep1();
    this.initFormStep2();
  }

  /**
   * Form 1
   */
  public initFormStep1(): void {
    this.formGroup1 = this.fb.group({
      phuongTienDeXuatKey: new FormControl('', Validators.required),
      hinhThucLaiXeKey: new FormControl('', Validators.required),
      dieuDongCongTacKey: new FormControl(), // Set init value bypass create
      khuVucKey: new FormControl('', Validators.required),
      tinhThanhKey: new FormControl('', Validators.required),
      quanHuyenKey: new FormControl('', Validators.required)
    });
    // Onchange tinh thanh dropbox
    this.f1.tinhThanhKey.valueChanges.subscribe(value => {
      if (value) {
        this.f1.quanHuyenKey.setValue(null);
        this.getQuanHuyen(value);
      }
    });
  }

  get f1() { return this.formGroup1.controls; }

  /**
   * Form 2
   */
  public initFormStep2(): void {
    this.formGroup2 = this.fb.group({
      thoiGianDi: new FormControl('', Validators.required),
      thoiGianVe: new FormControl('', Validators.required),
      noiDungCongViec: new FormControl('', Validators.required),
      chiTietHanhTrinh: new FormControl('', Validators.required),
      ghiChu: new FormControl(''),
      isTrongKeHoach: new FormControl('', Validators.required)
    })
  }

  get f2() { return this.formGroup2.controls; }

  /**
   * Show modal
   * @param isShow
   */
  public showModal() {
    this.getKhuVuc();
    this.getTinhThanh();
    this.getLoaiXeOptions();
    this.getHinhThucLaiXeOptions();
    this.initFormStep3();
    //===========================
    this.step = 1;
    this.isVisible = true;
  }

  /**
   * Submit create
   * @param index 
   */
  public onSubmit() {
    if (this.formGroup1.invalid || this.formGroup2.invalid || this.dongTrinhDS.length === 0) {
      return;
    }
    const DSNguoiDi = this.dongTrinhDS.map(m => ({ nguoiDiDepartmentKey: m.nguoiDiDepartmentKey, nguoiDiEmployeeKey: m.nguoiDiEmployeeKey }));

    const params = {
      ...this.formGroup1.value,
      ...this.formGroup2.value,
      thoiGianDi: Math.floor(new Date(this.f2.thoiGianDi.value).getTime() / 1000),
      thoiGianVe: Math.floor(new Date(this.f2.thoiGianVe.value).getTime() / 1000),
      nguoiDis: DSNguoiDi,
      nguoiDiKhacs: []
    };

    this.api.post('/api/xeduadon-create', params).subscribe(res => {
      if (res) {
        swal({
          icon: "success",
          title: 'Thêm đăng ký xe đưa đón thành công.',
          buttons: {
            ok: this.translate.instant('COMMON.btn.close'),
          },
        } as any).then(() => {
          this.isVisible = false;
          this.cdf.detectChanges();
          this.loadList.emit();
        });
      }
    }, err => {
      this.api.errorMessage(err);
    });
  }

  /**
   * Next step >>
   * @param index 
   */
  public nextStep(index) {
    if (index == 2 && (this.formGroup1.invalid)) {
      this.formGroup1.markAllAsTouched();
      return // reject
    }
    if (index == 3 && (this.formGroup1.invalid || this.formGroup2.invalid)) {
      this.formGroup2.markAllAsTouched();
      return // reject
    }
    if (index == 4 && (this.formGroup1.invalid || this.formGroup2.invalid || this.dongTrinhDS.length === 0)) {
      return // reject
    }
    if (index) {
      this.step = index; // Next
    } else {
      this.step += 1; // Next ++
    }
  }

  /**
   * prevStep <<
   */
  public prevStep() {
    this.step -= 1;
  }

  public initFormStep3() {
    this.getBoPhan();
  }

  /**
   * Track FN
   * @param index 
   * @returns 
   */
  public trackByFn(index: number) {
    return index;
  }

  /**
   * Close modal
   */
  public onClose() {
    this.isVisible = false;
  }

  public addDongTrinhDSRow(e) {
    this.dongTrinhDS.push({
      nguoiDiDepartmentKey: this.partSelected,
      nguoiDiDepartmentDisplay: this.partOptions?.find(f => f?.value == this.partSelected)?.label,
      nguoiDiEmployeeKey: e,
      nguoiDiEmployeeDisplay: this.fullnameOptions?.find(f => f?.value == e)?.label,
    })
  }

  public removeDongTrinhDSRow(i) {
    this.dongTrinhDS = this.dongTrinhDS.filter((f, j) => i != j);
  }

  public async getDieuDongCongTac() {
    this.dieuDongCongTacOptions = await this.api.get('/api/xeduadon-danhmuc/dieudong-congtac')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.dieuDongCongTacKey, label: m.dieuDongCongTacDisplay })))))
      .toPromise();
  }

  /**
   * Get loại options
   */
  public getLoaiXeOptions() {
    this.api.get('/api/xeduadon-danhmuc/phuongtien-dexuat')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.phuongTienDeXuatKey, label: m.phuongTienDeXuatDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.loaiXeOptions = res;
        }
      })
  }

  /**
   * Get hình thức lái xe options
   */
  public getHinhThucLaiXeOptions() {
    this.api.get('/api/xeduadon-danhmuc/hinhthuc-laixe')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.hinhThucLaiXeKey, label: m.hinhThucLaiXeDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.hinhThucLaiXeOptions = res;
        }
      })
  }

  /**
   * Get khu vuc
   */
  public async getKhuVuc() {
    this.khuVucOptions = await this.api.get('/api/xeduadon-danhmuc/khu-vuc')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.khuVucKey, label: m.khuVucDisplay })))))
      .toPromise();
  }

  /**
   * Get bo phan
   */
  public getBoPhan() {
    this.api.get('/api/xeduadon-danhmuc/nguoidi-department').pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.nguoiDiDepartmentKey, label: m.nguoiDiDepartmentDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.partOptions = res;
        }
      })
  }

  /**
   * Get nhan vien
   */
  public getNhanVien(nguoiDiDepartmentKey: number) {
    this.api.get('/api/xeduadon-danhmuc/nguoidi-employee', { nguoiDiDepartmentKey: nguoiDiDepartmentKey }).pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.nguoiDiEmployeeKey, label: m.nguoiDiEmployeeDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.fullnameOptions = res;
        }
      })
  }

  /**
   * Get tinh thanh
   */
  public getTinhThanh() {
    this.api.get('/api/xeduadon-danhmuc/tinh-thanh').pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.tinhThanhKey, label: m.tinhThanhDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.tinhThanhOptions = res;
        }
      })
  }

  /**
   * Get quan huyen
   */
  public getQuanHuyen(tinhThanhKey: number) {
    this.api.get('/api/xeduadon-danhmuc/quan-huyen', { tinhThanhKey: tinhThanhKey }).pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.quanHuyenKey, label: m.quanHuyenDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.quanHuyenOptions = res;
        }
      })
  }

  /**
   * Dynamic
   * @param dataName 
   * @param key 
   * @returns 
   */
  public getObjByDataOptions(dataName: string, key: string) {
    return this[dataName]?.find(f => f?.value === key);
  }
}
