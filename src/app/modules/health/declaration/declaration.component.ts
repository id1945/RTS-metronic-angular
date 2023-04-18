import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Component, OnInit, OnChanges } from '@angular/core';
import { HealthDeclaration } from './declaration.model';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import { Options } from 'src/app/_metronic/shared/shared/models/options';
import { switchMap, filter } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-declaration',
  templateUrl: './declaration.component.html',
  styleUrls: ['./declaration.component.scss']
})
export class DeclarationComponent implements OnInit {

  public isAlertSuccess = false;

  public formGroup1: FormGroup;
  public form1 = [
    { field: 'sot', value: false, required: true, label: 'Sốt' },
    { field: 'ho', value: false, required: true, label: 'Ho' },
    { field: 'khoTho', value: false, required: true, label: 'Khó thở' },
    { field: 'viemPhoi', value: false, required: true, label: 'Viêm phổi' },
    { field: 'dauHong', value: false, required: true, label: 'Đau họng' },
    { field: 'metMoi', value: false, required: true, label: 'Mệt mỏi' },
  ]

  public formGroup2: FormGroup;
  public hasFOptions: Options[] = [
    { label: 'F0', value: 'F0' },
    { label: 'F1', value: 'F1' },
    { label: 'F2', value: 'F2' },
    { label: 'F3', value: 'F3' },
  ];
  public form2 = [
    { field: 'tiepXucNguoiBenh', value: false, required: true, label: 'Người bệnh hoặc nghi ngờ, mắc bệnh COVID-19' },
    { field: 'hasF', value: false, required: true, label: 'Anh/Chị tiếp xúc với người' },
    { field: 'tiepXucNguoiTuNuocCoBenh', value: false, required: true, label: 'Người từ nước có bệnh COVID-19' },
    { field: 'tiepXucNguoiSot', value: false, required: true, label: 'Người có biểu hiện (Sốt, ho, khó thở , Viêm phổi)' },
  ]

  public formGroup3: FormGroup;
  public form3 = [
    { field: 'ganManTinh', value: false, required: true, label: 'Bệnh gan mãn tĩnh' },
    { field: 'mauManTinh', value: false, required: true, label: 'Bệnh máu mãn tính' },
    { field: 'phoiManTinh', value: false, required: true, label: 'Bệnh phổi mãn tính' },
    { field: 'thanManTinh', value: false, required: true, label: 'Bệnh thận mãn tĩnh' },
    { field: 'timMach', value: false, required: true, label: 'Bệnh tim mạch' },
    { field: 'huyetApCao', value: false, required: true, label: 'Huyết áp cao ' },
    { field: 'suyGiamMienDich', value: false, required: true, label: 'Suy giảm miễn dịch' },
    { field: 'nguoiNhanGhepTang', value: false, required: true, label: 'Người nhận ghép tạng , Thủy xương' },
    { field: 'tieuDuong', value: false, required: true, label: 'Tiểu đường' },
    { field: 'ungThu', value: false, required: true, label: 'Ung thư' },
  ]

  public formGroup4: FormGroup;
  public form4 = [
    { field: 'thoiGianThaiKy', value: false, required: true, label: 'Bạn có đang trong thời gian thai kỳ hay không?' },
    { field: 'diChuyenNuocNgoai', value: false, required: true, label: 'Trong vòng 14 ngày qua, Anh/Chị có đến quốc gia/vùng lãnh thổ nào không?' },
    { field: 'diChuyenTrongNuoc', value: false, required: true, label: 'Anh/Chị có di chuyển qua tỉnh khác trong nước không?' },
  ]

  public formGroup5: FormGroup;
  public danhMucTinhOptions: Options[] = [];
  public phuongTienOptions: Options[] = [
    { label: 'Máy Bay', value: 'Máy Bay' },
    { label: 'Tàu Hỏa', value: 'Tàu Hỏa' },
    { label: 'Xe Khách', value: 'Xe Khách' },
    { label: 'Xe Máy', value: 'Xe Máy' },
    { label: 'Taxi', value: 'Taxi' },
    { label: 'Xe Công Ty', value: 'Xe Công Ty' },
    { label: 'Xe riêng (xe gia đình)', value: 'Xe riêng (xe gia đình)' },
  ];

  public dataDetail: HealthDeclaration;

  constructor(
    private api: ApiService,
    private fb: FormBuilder,
  ) { }

  async ngOnInit(): Promise<void> {
    // Init formGroup
    [1, 2, 3, 4].forEach(idx => this.initForm(idx));
    this.initFormChuyenDi();
    // Fetch data
    await this.fetchData();
    // Edit mode
    this.bindingEditMode();
  }

  /**
   * Create group, form dynamic
   */
  private initForm(idx: number) {
    let form = {};
    this['form' + idx]?.forEach((res) => {
      form = {
        ...form,
        [res?.field]: res.required ? [res?.value ?? '', Validators.required] : [res?.value ?? '']
      }
    });
    this['formGroup' + idx] = this.fb.group(form);
    // Handle change validate
    this.switchValidate();
  }

  /**
   * Chuyen di
   */
  private initFormChuyenDi() {
    this.formGroup5 = this.fb.group({
      phuongTienDiChuyen: [''],
      noiDi: [''],
      noiDen: [''],
      ngayKhoiHanh: [''],
      ngayToi: [''],
      lichTrinhDiChuyen: [''],
    });
  }

  get f5() { return this.formGroup5.controls; }

  /**
   * Control x
   * @param idx 
   * @returns 
   */
  public f(idx: number) { return this['formGroup' + idx]?.controls }

  /**
   * Validate 
   */
  private switchValidate(): void {
    // onChange
    // formGroup2
    this.f(2)?.tiepXucNguoiBenh?.valueChanges.subscribe(value => {
      if (value) {
        // validate phuongTienDiChuyen
        this.f(2)?.hasF?.setValidators([Validators.required]);
        this.f(2)?.hasF?.updateValueAndValidity();
      } else {
        // not validate phuongTienDiChuyen
        this.f(2)?.hasF?.clearValidators();
        this.f(2)?.hasF?.updateValueAndValidity();
      }
    })
    // formGroup4
    this.f(4)?.diChuyenTrongNuoc?.valueChanges.subscribe(value => {
      if (value) {
        // validate phuongTienDiChuyen
        this.f(5)?.phuongTienDiChuyen.setValidators([Validators.required]);
        this.f(5)?.phuongTienDiChuyen.updateValueAndValidity();
      } else {
        // not validate phuongTienDiChuyen
        this.f(5)?.phuongTienDiChuyen.clearValidators();
        this.f(5)?.phuongTienDiChuyen.updateValueAndValidity();
      }
    })
  }

  /**
   * GET
   * Load data
   */
  private async fetchData() {
    // Data detail
    this.dataDetail = await this.api.post('/api/khaibaoyte/getlastest', null).toPromise();
    // Option tỉnh
    this.danhMucTinhOptions = await this.api.post('/api/khaibaoyte/getdanhmuctinh', null)
      .pipe(switchMap(s => of(s?.map((m: any) => ({ value: m.name, label: m.name }))?.filter(f => f.value !== '--- Tỉnh / Thành phố ---'))))
      .toPromise();
  }

  /**
   * POST
   * Declaration
   * @returns 
   */
  public onSubmit() {
    this.isAlertSuccess = false;

    if (this.formGroup1.invalid || this.formGroup2.invalid || this.formGroup3.invalid || this.formGroup4.invalid || this.formGroup5.invalid) {
      this.formGroup5.markAllAsTouched();
      return false;
    }

    let bodyParams = {
      ...this.formGroup1.value,
      ...this.formGroup2.value,
      ...this.formGroup3.value,
      ...this.formGroup4.value,
      username: this.dataDetail?.username
    };

    // Người bệnh hoặc nghi ngờ, mắc bệnh COVID-19
    if (this.f(2)?.tiepXucNguoiBenh?.value == false) {
      delete bodyParams['hasF'];
    }

    // Có di chuyển qua tỉnh khác
    if (this.f(4)?.diChuyenTrongNuoc?.value) {
      bodyParams = {
        ...bodyParams,
        ...this.formGroup5.value,
        ngayKhoiHanh: Math.floor(new Date(this.f5.ngayKhoiHanh.value).getTime() / 1000),
        ngayToi: Math.floor(new Date(this.f5.ngayToi.value).getTime() / 1000),
      }
    } else {
      this.formGroup5.reset();
      bodyParams = {
        ...bodyParams,
        ...this.formGroup5.value,
        ngayKhoiHanh: Math.floor(new Date(this.f5.ngayKhoiHanh.value).getTime() / 1000),
        ngayToi: Math.floor(new Date(this.f5.ngayToi.value).getTime() / 1000),
      }
    }

    this.api.post('/api/khaibaoyte/khaibao', bodyParams).subscribe(res => {
      if (res) {
        this.isAlertSuccess = true;
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
        this.fetchData();
      }
    }, err => this.api.errorMessage(err))
  }

  /**
   * Binding edit
   */
  private bindingEditMode() {
    if (this.dataDetail) {
      // Edit mode - binding
      const updateValueToFormX = (idx: number) => this['form' + idx]?.map(m => {
        const isKey = Object.keys(this.dataDetail)?.find(key => key?.toLocaleLowerCase() === m?.field?.toLocaleLowerCase());
        if (isKey) {
          return { ...m, value: this.dataDetail[isKey] }
        }
        return m;
      });
      // Update value
      this.form1 = updateValueToFormX(1);
      this.form2 = updateValueToFormX(2);
      this.form3 = updateValueToFormX(3);
      this.form4 = updateValueToFormX(4);
      // Resst formGroup
      [1, 2, 3, 4, 5].forEach(idx => this['formGroup' + idx].reset());
      // Binding formGroup 1-4
      [1, 2, 3, 4].forEach(idx => this.initForm(idx));
      // Binding formGroup 5
      if (this.f(4)?.diChuyenTrongNuoc?.value && this.dataDetail) {
        this.formGroup5.patchValue({
          phuongTienDiChuyen: this.dataDetail?.phuongTienDiChuyen,
          noiDi: this.dataDetail?.noiDi,
          noiDen: this.dataDetail?.noiDen,
          ngayKhoiHanh: this.dataDetail?.ngayKhoiHanh ? this.dataDetail?.ngayKhoiHanh * 1000 : '',
          ngayToi: this.dataDetail?.ngayToi ? this.dataDetail?.ngayToi * 1000 : '',
          lichTrinhDiChuyen: this.dataDetail?.lichTrinhDiChuyen,
        });
      }
    }
  }

  /**
   * Detect change
   * @param index 
   * @returns 
   */
  public trackByFn(index: number) {
    return index;
  }
}
