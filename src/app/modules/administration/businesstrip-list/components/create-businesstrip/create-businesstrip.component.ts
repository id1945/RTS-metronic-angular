import { TranslateService } from '@ngx-translate/core';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Options } from 'src/app/_metronic/shared/shared/models/options';
import { XeDuaDon, XeDuaDonNguoiDi } from '../../models/xe-dua-don.model';
import swal from 'sweetalert';
import { convertNullToBlank } from 'src/app/_metronic/shared/shared/common/helper';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import { differenceInCalendarDays } from 'date-fns';

interface NguoiDi {
  employeKey: string;
  departmentKey: string;
}

@Component({
  selector: 'app-create-businesstrip',
  templateUrl: './create-businesstrip.component.html',
  styleUrls: ['./create-businesstrip.component.scss']
})
export class CreateBusinessTripComponent implements OnInit {

  public today = new Date();
  public params: any;

  public formGroup1: FormGroup;
  public formGroup2: FormGroup;

  public boPhanOptions: Options[];
  public hoTenOptions: Options[];
  public taiXeOptions: Options[];
  public xeOptions: Options[];
  public xeDuaDonDetail: XeDuaDon;
  public nguoiDiSelected: XeDuaDonNguoiDi = {
    nguoiDiEmployeeKey: '',
    nguoiDiDepartmentKey: '',
    nguoiDiDepartmentKhac: '',
    nguoiDiEmployeeKhac: '',
  }

  public isLoading = false;

  constructor(
    public api: ApiService,
    private fb: FormBuilder,
    private router: Router,
    private aRoute: ActivatedRoute,
    private translate: TranslateService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.aRoute.params.subscribe(params => {
      if (params) {
        this.params = params;
      }
    })
    this.initForm();
    //======= Load option
    await this.getXeDuaDon();
    this.getBoPhan();
    this.getXe();
    this.getTaiXe();
    //======= Binding vao table nguoi di
    this.bindingTableNguoiDi();
  }

  private initForm() {
    this.formGroup1 = this.fb.group({
      hoSoIdYeuCau: [this.params?.hoSoId],
      taiXeId: ['', Validators.required],
      taiXeHoTen: [],
      taiXeSoDT: [],
      isTaiXeKhac: [false],
      xeDonId: ['', Validators.required],
      xeDonBienSo: [],
      xeDonTenXe: [],
      isXeKhac: [false],
      thoiGianDon: ['', Validators.required],
      diaChiDon: ['', Validators.required],
      hinhThucDichVu: ['Công ty', Validators.required],
      matKhauThanhToan: [],
      taiKhoanThanhToan: [],
      ghiChu: [],
      nguoiDis: this.fb.array([]) // Array - dynamic form
    });
    this.formGroup2 = new FormGroup({
      nguoiDiKhac: new FormControl(false),
      nguoiDiEmployeeKhac: new FormControl('', Validators.required),
      nguoiDiDepartmentKhac: new FormControl('', Validators.required)
    });
    // OnChange add phone and car name.
    this.f1.taiXeId.valueChanges.subscribe(res => {
      if (res) {
        this.f1.taiXeSoDT.setValue(this.getObjByKeyOptions('taiXeOptions', res)?.phone);
      }
    })
    this.f1.xeDonId.valueChanges.subscribe(res => {
      if (res) {
        this.f1.xeDonTenXe.setValue(this.getObjByKeyOptions('xeOptions', res)?.type);
      }
    })
    // OnChange clear
    this.f1.isTaiXeKhac.valueChanges.subscribe(res => {
      if (res) {
        this.f1.taiXeId.setValue('');
        this.f1.taiXeSoDT.setValue('');
        // clear validate
        this.f1.taiXeId.clearValidators();
        this.f1.taiXeHoTen.setValidators(Validators.required);
      } else {
        // add validate
        this.f1.taiXeId.setValidators(Validators.required);
        this.f1.taiXeHoTen.clearValidators();
      }
      // register validate
      this.f1.taiXeId.updateValueAndValidity();
      this.f1.taiXeHoTen.updateValueAndValidity();
    });
    this.f1.isXeKhac.valueChanges.subscribe(res => {
      if (res) {
        this.f1.xeDonId.setValue('');
        this.f1.xeDonTenXe.setValue('');
        // clear validate
        this.f1.xeDonId.clearValidators();
        this.f1.xeDonBienSo.setValidators(Validators.required);
      } else {
        // add validate
        this.f1.xeDonId.setValidators(Validators.required);
        this.f1.xeDonBienSo.clearValidators();
      }
      // register validate
      this.f1.xeDonId.updateValueAndValidity();
      this.f1.xeDonBienSo.updateValueAndValidity();
    });
  }

  public trackByFn(index: number, item: any) {
    return index;
  }

  get f1() { return this.formGroup1.controls; }
  get ctNguoiDis() { return this.f1.nguoiDis; }
  get f2() { return this.formGroup2.controls; }

  /**
   * @param item 
   * @returns 
   */
  public createItem(nguoiDi: XeDuaDonNguoiDi) {
    return this.fb.group({
      nguoiDiEmployeeKey: nguoiDi?.nguoiDiEmployeeKey ? [nguoiDi?.nguoiDiEmployeeKey, Validators.required] : [nguoiDi?.nguoiDiEmployeeKey],
      nguoiDiDepartmentKey: nguoiDi?.nguoiDiDepartmentKey ? [nguoiDi?.nguoiDiDepartmentKey, Validators.required] : [nguoiDi?.nguoiDiDepartmentKey],
      nguoiDiEmployeeDisplay: [nguoiDi?.nguoiDiEmployeeDisplay ?? ''],
      nguoiDiDepartmentDisplay: [nguoiDi?.nguoiDiDepartmentDisplay ?? ''],
      // Người di khac
      nguoiDiEmployeeKhac: [nguoiDi?.nguoiDiEmployeeKhac ?? ''],
      nguoiDiDepartmentKhac: [nguoiDi?.nguoiDiDepartmentKhac ?? ''],
    })
  }

  /**
   * Add item
   */
  public addRow(nguoiDi: XeDuaDonNguoiDi = null) {
    // Add new
    (this.f1.nguoiDis as FormArray).push(this.createItem(nguoiDi));
    // Reset formGroup2
    this.f2.nguoiDiEmployeeDisplay.setValue('');
    this.f2.nguoiDiDepartmentDisplay.setValue('');
  }

  /**
   * Select bo phan
   * @param key 
   */
  public onChangeBoPhan(key) {
    this.getHoTen(key);
  }

  /**
   * Select dropbox
   * @param key 
   */
  public onChangeAddNguoiDi(key) {
    const nguoiDi: XeDuaDonNguoiDi = {
      nguoiDiEmployeeKey: key,
      nguoiDiDepartmentKey: this.nguoiDiSelected.nguoiDiDepartmentKey,
      nguoiDiEmployeeDisplay: this.getObjByKeyOptions('hoTenOptions', key)?.label,
      nguoiDiDepartmentDisplay: this.getObjByKeyOptions('boPhanOptions', this.nguoiDiSelected.nguoiDiDepartmentKey)?.label,
    }
    this.addRow(nguoiDi);
  }

  /**
   * Submit formGroup2
   * @returns 
   */
  public onAddNguoiDiForm2() {
    if (this.formGroup2.invalid) {
      this.formGroup2.markAllAsTouched();
      return;
    }
    const nguoiDi: XeDuaDonNguoiDi = {
      nguoiDiEmployeeKhac: this.f2.nguoiDiEmployeeKhac?.value,
      nguoiDiDepartmentKhac: this.f2.nguoiDiDepartmentKhac?.value,
    }
    this.addRow(nguoiDi);
  }

  /**
   * Remove item
   * @param idx 
   */
  public removeRow(idx: number): void {
    (this.f1.nguoiDis as FormArray).removeAt(idx);
  }

  public isControlInvalid(controlName: string, group: string): boolean {
    return this[group][controlName].invalid && this[group][controlName].touched;
  }

  /**
   * Submit
   */

  public onSubmit() {
    if (this.formGroup1.invalid || this.ctNguoiDis?.value?.length === 0) {
      this.formGroup1.markAllAsTouched();
      return;
    }

    const nguoiDis = this.ctNguoiDis?.value?.map((m: XeDuaDonNguoiDi) => {
      delete m.nguoiDiEmployeeDisplay;
      delete m.nguoiDiDepartmentDisplay;
      return m;
    });

    let bodyParams = {
      ...this.formGroup1.value,
      thoiGianDon: Math.floor(new Date(this.f1.thoiGianDon.value).getTime() / 1000),
      nguoiDis: nguoiDis,
      khuVucId: this.xeDuaDonDetail?.khuVucId,
      isTrongKeHoach: this.xeDuaDonDetail?.isTrongKeHoach
    };

    // Hình thức dịch vụ
    switch (this.f1?.hinhThucDichVu?.value) {
      case 'Mai Linh':
        delete bodyParams.taiKhoanThanhToan;
        break;
      case 'Grap':
        delete bodyParams.matKhauThanhToan;
        break;
      default:
        delete bodyParams.matKhauThanhToan;
        delete bodyParams.taiKhoanThanhToan;
        break;
    }

    // Chọn lái xe
    if (this.f1?.isTaiXeKhac?.value === false) {
      delete bodyParams.taiXeHoTen;
      delete bodyParams.taiXeSoDT;
    }

    // Chọn xe
    if (this.f1?.isXeKhac?.value === false) {
      delete bodyParams.xeDonBienSo;
      delete bodyParams.xeDonTenXe;
    }

    convertNullToBlank(bodyParams);

    this.api.post('/api/chuyendi-create', bodyParams).subscribe(res => {
      if (res) {
        swal({
          icon: "success",
          title: 'Thêm chuyến đi thành công.',
          buttons: {
            ok: this.translate.instant('COMMON.btn.close'),
          },
        } as any).then(() => {
          this.router.navigateByUrl('/administration/bussinesstrip');
        });
      }
    }, err => {
      this.api.errorMessage(err);
    });
  }

  /**
   * Get data
   */

  public getObjByKeyOptions(dataName: string, key: string) {
    return this[dataName]?.find(f => f?.value === key);
  }

  public getBoPhan() {
    this.api.get('/api/chuyendi-danhmuc/nguoidi-department')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m?.nguoiDiDepartmentKey, label: m?.nguoiDiDepartmentDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.boPhanOptions = res;
        }
      });
  }

  public getHoTen(key) {
    this.api.get('/api/chuyendi-danhmuc/nguoidi-employee', { nguoiDiDepartmentKey: key })
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m?.nguoiDiEmployeeKey, label: m?.nguoiDiEmployeeDisplay, role: m?.chucVuDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.hoTenOptions = res;
        }
      });
  }

  public getTaiXe() {
    const queryParams = {
      searchText: '',
      KhuVucId: this.xeDuaDonDetail?.khuVucId,
    }
    this.api.getOffLoading('/api/chuyendi-danhmuc/tai-xe', queryParams)
      .pipe(
        switchMap(s => of(s?.items?.map((m: any) => ({ value: m?.taiXeKey, label: m?.hoTenTaiXeDisplay, phone: m?.dienThoaiTaiXeDisplay })))),
      )
      .subscribe((res: any) => {
        if (res) {
          this.taiXeOptions = res;
        }
        this.isLoading = false
      }, () => this.isLoading = false);
  }

  public getXe() {
    const queryParams = {
      searchText: '',
      KhuVucId: this.xeDuaDonDetail?.khuVucId,
    }
    this.api.getOffLoading('/api/chuyendi-danhmuc/danh-sach-xe', queryParams)
      .pipe(
        switchMap(s => of(s?.items?.map((m: any) => ({ value: m?.xeKey, label: m?.bienSoXeDisplay, type: m?.loaiXeDisplay })))),
      )
      .subscribe((res: any) => {
        if (res) {
          this.xeOptions = res;
        }
        this.isLoading = false
      }, () => this.isLoading = false);
  }

  public async getXeDuaDon() {
    this.xeDuaDonDetail = await this.api.get('/api/xeduadon-detail', { HoSoId: this.params?.hoSoId }).toPromise();
  }

  public onChangeHinhThucDV(e) {
    if (e === 'Mai Linh' || e === 'Grap') {
      this.f1.taiXeId.clearValidators();
      this.f1.xeDonId.clearValidators();
    } else {
      this.f1.taiXeId.setValidators([Validators.required]);
      this.f1.xeDonId.setValidators([Validators.required]);
    }
    this.f1.taiXeId.updateValueAndValidity();
    this.f1.xeDonId.updateValueAndValidity();
  }

  /**
   * Binding
   */
  private bindingTableNguoiDi(): void {
    this.xeDuaDonDetail?.nguoiDi?.items?.forEach(el => {
      this.addRow(el);
    });
  }
}
