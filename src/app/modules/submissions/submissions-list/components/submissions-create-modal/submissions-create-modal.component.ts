import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import swal from 'sweetalert';
import { uniqBy } from 'lodash-es';

import { Options } from 'src/app/_metronic/shared/shared/models/options';
import serialize from "@octetstream/object-to-form-data"
import { configTextEditor, formatterInputNumber, parserInputNumber } from 'src/app/_metronic/shared/shared/common/helper';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import { SelectedFiles } from 'src/app/_metronic/shared/shared/services/files.service';
import { AuthService } from 'src/app/modules/auth';

@Component({
  selector: 'app-submissions-create-modal',
  templateUrl: './submissions-create-modal.component.html',
  styleUrls: ['./submissions-create-modal.component.scss']
})
export class SubmissionsCreateModalComponent implements OnInit {

  @Output() loadList = new EventEmitter;
  @Input() public isVisible = false;

  // format input number
  public formatter = formatterInputNumber;
  public parser = parserInputNumber;

  public step: number;
  public today = new Date();

  // Step 1
  public formGroupTTTT: FormGroup;
  public loaiNghiepVuOptions: Options[] = [];
  public quyTrinhOptions: Options[] = [];
  public radioValue = true;
  public selectedFiles: SelectedFiles[] = [];
  // Config TextEditor
  public config = configTextEditor;

  // Step 2
  public maChiPhiOptions: Options[] = [];
  public maNganSachOptions: Options[] = []
  public formGroupCP: FormGroup;
  public fArray: FormArray;
  public isSpinning = false;
  public isToTrinhHanMucChiPhi = false;

  public namOptions: Options[] = [];
  public thangOptions: Options[] = [];

  // Step 3
  public partSelected: any;
  public partOptions: Options[] = [];
  public fullnameSelected: any;
  public fullnameOptions: Options[] = [];
  public dongTrinhDS: any[] = [];

  public userInfo: any;

  constructor(
    public api: ApiService,
    private fb: FormBuilder,
    private auth: AuthService,
    private translate: TranslateService,
  ) {
  }

  public showModal(isShow) {
    this.step = 1;
    this.isVisible = isShow;
    // Load data dropbox
    this.getLoaiNghiepVuOptions();
    this.getQuyTrinhOptions();
    this.getMaToTrinh();
    this.getMaChiPhiOptions();
    this.getNamOptions();
    this.getThangOptions();
    this.ngOnInit();
  }

  ngOnInit() {
    // Form step 1
    this.initFormStep1()
    // Form step 2
    this.initFormStep2()
    // Form step 3
    this.initFormStep3()
    // Binding Draft
    this.bindingDaft()

    // Step 4
    this.userInfo = this.auth.currentUserValue;
  }

  /**
   * Step 1
   * Init or reset FormGroup
   */
  public initFormStep1() {
    this.selectedFiles = [];
    this.formGroupTTTT = this.fb.group({
      IsMucDoTrinhKyGap: [false], //Mức độ trình ký
      SoToTrinh: [''], // Mã tờ trình
      MaHanhChinh: [''], // Mã hành chính
      TenToTrinh: new FormControl('', Validators.required), // Tên tờ trình
      TenToTrinh_Eng: new FormControl('', Validators.required), // Tên tờ trình
      IsTrongNganSach: [true], // Ngân sách
      LoaiNghiepVuKey: new FormControl('', Validators.required), // Loại nghiệp vụ
      quyTrinhKey: new FormControl(''), // Loại nghiệp vụ
      NoiDung: new FormControl('', Validators.required), // Nội dung
      NoiDung_Eng: new FormControl('', Validators.required), // Nội dung
    })
  }

  public get fTTTT() { return this.formGroupTTTT.controls; }

  /**
   * Step 2
   * Init or reset FormGroup
   */
  public initFormStep2() {
    // FormGroup
    this.formGroupCP = new FormGroup({
      fArray: this.fb.array([], Validators.required)
    })
  }

  public get fCP() { return this.formGroupCP.controls; }
  public get fACP() { return this.fCP?.fArray['controls']; }

  public createItem(item?) {
    return this.fb.group({
      khoanChi: [item?.khoanChi ?? '', Validators.required],
      soLuong: [item?.soLuong ?? '', Validators.required],
      donGiaDuKien: [item?.donGiaDuKien ?? '', Validators.required],
      thanhTienDuKien: [item?.thanhTienDuKien ?? ''],
      maChiPhiKey: [item?.maChiPhiKey ?? ''],
      yearPay: new Date().getFullYear(),
      monthPay: new Date().getMonth() + 1
    })
  }

  public addChiPhiRow() {
    (this.fCP?.fArray as FormArray).push(this.createItem());
  }

  public removeChiPhiRow(idx: number): void {
    (this.fCP?.fArray as FormArray).removeAt(idx);
  }

  /**
   * Step 3
   * Init or reset FormGroup
   */
  public initFormStep3() {
    this.getBoPhan();
  }

  public trackByFn(index: number) {
    return index;
  }

  public onSubmit() {
    if (this.formGroupTTTT.invalid || this.selectedFiles?.length === 0) {
      return;
    }

    const dongTrinhDSCover = this.dongTrinhDS.map(m => ({ departmentKey: m.departmentKey, employeeKey: m.employeeKey }));

    const params = {
      ...this.formGroupTTTT.value,
      ...this.formGroupCP.value,
      ChiPhis: this.fCP?.fArray?.value,
      BoPhanDongTrinhs: dongTrinhDSCover
    };

    delete params.fArray;

    let formData = serialize(params);

    this.selectedFiles.forEach(f => {
      formData.append('DinhKems', f?.file);
    })

    this.api.post('/api/totrinh-duyetchi-create', formData).subscribe(res => {
      if (res) {
        swal({
          icon: "success",
          title: 'Thêm tờ trình thành công.',
          buttons: {
            ok: this.translate.instant('COMMON.btn.close'),
          },
        } as any).then(() => {
          this.isVisible = false;
          this.loadList.emit();
          this.removeDraft();
        });
      }
    }, err => {
      this.api.errorMessage(err);
    });
  }

  /**
   * Step 1
   */
  public getLoaiNghiepVuOptions() {
    this.api.get('/api/totrinh-duyetchi-danhmuc/loai-nghiep-vu')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.loaiNghiepVuKey, label: m.loaiNghiepVuDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.loaiNghiepVuOptions = res;
        }
      })
  }

  public getQuyTrinhOptions() {
    this.api.get('/api/totrinh-duyetchi-danhmuc/quy-trinh')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.quyTrinhKey, label: m.quyTrinhDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.quyTrinhOptions = res;
        }
      })
  }

  /**
   * Step 1
   */
  public getMaToTrinh() {
    this.api.get('/api/totrinh-duyetchi-create')
      .subscribe((res: any) => {
        if (res) {
          this.formGroupTTTT.patchValue({
            SoToTrinh: res.soToTrinh,
            MaHanhChinh: res.maHanhChinh
          })
        }
      })
  }

  /**
   * Step 2
   */
  public getMaChiPhiOptions() {
    this.api.get('/api/totrinh-duyetchi-danhmuc/ma-chi-phi')
    .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.maChiPhiKey, label: m.maChiPhiDisplay })))))
    .subscribe((res: any) => {
      if (res) {
        this.maChiPhiOptions = res;
      }
    })
   
  }

  public getNamOptions() {
    this.api.get('/api/kehoach-congtac-dm/nam')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.namKey, label: m.namDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.namOptions = res;
        }
      })
  }

  public getThangOptions() {
  
      this.api.get('/api/kehoach-congtac-dm/thang')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.thangKey, label: m.thangDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.thangOptions = res;
        }
      })
  }

  public nextStep(index) {
    if (index == 2 && (this.formGroupTTTT.invalid || this.selectedFiles?.length === 0)) {
      this.formGroupTTTT.markAllAsTouched();
      return // reject
    }
    if (index == 3 && ((this.isToTrinhHanMucChiPhi && this.formGroupCP.invalid) || this.formGroupTTTT.invalid || this.selectedFiles?.length === 0)) {
      this.formGroupCP.markAllAsTouched();
      return // reject
    }
    if (index == 4 && ((this.isToTrinhHanMucChiPhi && this.formGroupCP.invalid) || this.formGroupTTTT.invalid || this.selectedFiles?.length === 0)) {
      return // reject
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

  public scroll(el?: HTMLElement, timeout = 0) {
    if (timeout) {
      setTimeout(() => {
        el && el.scrollIntoView();
      }, timeout);
    } else {
      el && el.scrollIntoView();
    }
  }

  public handleCalc(item, i) {
    const value = { ...item, thanhTienDuKien: Number(item?.donGiaDuKien) * Number(item?.soLuong) };
    (this.fCP?.fArray as FormArray)?.controls?.[i]?.patchValue(value);
  }

  get total() {
    return this.fCP?.fArray?.value?.reduce(function (total, currentValue) { return Number(total) + Number(currentValue?.thanhTienDuKien) }, 0);
  }

  public chiPhiName(key) {
    return this.maChiPhiOptions.find(f => f.value == key)?.label ?? '';
  }

  public namName(key) {
    return this.namOptions.find(f => f.value == key)?.label ?? '';
  }

  public thangName(key) {
    return this.thangOptions.find(f => f.value == key)?.label ?? '';
  }


  public addDongTrinhDSRow(e) {
    const exist = this.dongTrinhDS.find(f => f?.departmentKey === this.partSelected && f?.employeeKey === e);
    if (!exist && e) {
      this.dongTrinhDS.push({
        departmentKey: this.partSelected,
        departmentDisplay: this.partOptions?.find(f => f?.value == this.partSelected)?.label,
        employeeKey: e,
        employeeDisplay: this.fullnameOptions?.find(f => f?.value == e)?.label,
      })
    }
  }

  public removeDongTrinhDSRow(i) {
    this.dongTrinhDS = this.dongTrinhDS.filter((f, j) => i != j);
  }

  public getBoPhan() {
    this.api.get('/api/totrinh-duyetchi-danhmuc/bo-phan').pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.departmentKey, label: m.departmentDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.partOptions = res;
        }
      })
  }

  public getNhanVien(departmentKey: number) {
    this.api.get('/api/totrinh-duyetchi-danhmuc/nhan-vien', { departmentKey: departmentKey }).pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m?.employeeKey, label: m?.employeeDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.fullnameOptions = res;
        }
      })
  }

  public saveDraft() {
    const draft = {
      // Step 1
      formGroupTTTT: this.formGroupTTTT.value,
      // Step 2
      formGroupCP: this.fCP?.fArray.value,
      // Step 3
      dongTrinhDS: this.dongTrinhDS,
      partSelected: this.partSelected,
    }
    this.isVisible = false;
    localStorage.setItem('SUBMISSIONS_DRAFT', JSON.stringify(draft));
  }

  public removeDraft() {
    localStorage.removeItem('SUBMISSIONS_DRAFT');
    this.initFormStep1();
    this.initFormStep2();
    this.dongTrinhDS = [];
  }

  public bindingDaft() {
    const data = localStorage.getItem('SUBMISSIONS_DRAFT');
    if (data) {
      const dataJson = JSON.parse(data);
      this.formGroupTTTT.setValue(dataJson?.formGroupTTTT);
      dataJson?.formGroupCP?.forEach(task => {
        (this.fCP?.fArray as FormArray).push(this.createItem(task));
      });
      this.dongTrinhDS = dataJson?.dongTrinhDS;
      this.partSelected = dataJson?.partSelected;
      this.getNhanVien(this.partSelected);
      // this.isToTrinhHanMucChiPhi = dataJson?.formGroupTTTT?.IsTrongNganSach;
    } else {
      this.removeDraft();
    }
  }

  public onChangeToTrinhHanMucChiPhi(e) {
    if (!this.isToTrinhHanMucChiPhi) {
      this.initFormStep2(); // reset form
      this.fCP.fArray.clearValidators(); // Don't required
      this.fCP.fArray.updateValueAndValidity();
    }
     else {
      this.fCP.fArray.setValidators([Validators.required]); // required
      this.fCP.fArray.updateValueAndValidity();
    }
    // this.formGroupTTTT.patchValue({ IsTrongNganSach: this.isToTrinhHanMucChiPhi });
  }

  public uniqBoPhan(data: any[], key: string) {
    return uniqBy(data, key);
  }

}

