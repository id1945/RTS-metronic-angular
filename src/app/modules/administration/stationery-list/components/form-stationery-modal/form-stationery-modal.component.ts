import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { switchMap, map } from 'rxjs/operators';
import { AuthService } from 'src/app/modules/auth';
import swal from 'sweetalert';
import { of } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { DetailVPP, MatHang } from '../../models/mat-hang.model';
import { Options } from 'src/app/_metronic/shared/shared/models/options';
import { formatterInputNumber, parserInputNumber } from 'src/app/_metronic/shared/shared/common/helper';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';

@Component({
  selector: 'app-form-stationery-modal',
  templateUrl: './form-stationery-modal.component.html',
  styleUrls: ['./form-stationery-modal.component.scss']
})
export class StationeryModalComponent implements OnInit {

  @Output() loadList = new EventEmitter;
  @Input() public isVisible = false;

  // format input number
  public formatter = formatterInputNumber;
  public parser = parserInputNumber;

  public step: number;
  public today = new Date();

  // Step 1
  public formGroup1: FormGroup;
  public khuVucOptions: Options[] = [];
  // Step 2
  public formGroup2: FormGroup;
  public matHangs: MatHang[] = [];
  public matHangsFound: MatHang[] = [];
  public trangThaiMuas: Options[] = [];
  public nguoiSuDungOptions: Options[] = [];
  public matHangOptions: Options[] = [];
  public donViTinhOptions: Options[] = [];

  // Step 3
  public selectedFiles: any[] = [];

  // Update
  public dataDetail: DetailVPP;
  public hoSoId: string;

  constructor(
    public auth: AuthService,
    private fb: FormBuilder,
    private api: ApiService,
    private cdf: ChangeDetectorRef,
    private translate: TranslateService
  ) {
  }

  ngOnInit() {
    this.initFormStep1();
    this.initFormStep2();
  }

  /**
   * Show modal
   */
  public async showModal(hoSoId?: string) {
    this.step = 1;
    this.hoSoId = hoSoId;
    //==============
    this.getKhuVuc();
    await this.getMatHang();
    // this.getStatusMua();
    this.getNguoiSuDung();
    //==============
    this.ngOnInit();
    this.isVisible = true;
    //==============
    if (hoSoId) {
      // Edit mode
      this.loadUpdate(hoSoId);
    } else {
      // Create mode
      this.loadDraft();
    }
  }

  /**
   * Form 1
   */
  public initFormStep1(): void {
    this.formGroup1 = this.fb.group({
      khuVucKey: new FormControl('', Validators.required),
      ghiChu: new FormControl(''),
    })
  }

  get f1() { return this.formGroup1.controls; }

  /**
   * Form 2
   */
  public initFormStep2(): void {
    this.formGroup2 = this.fb.group({
      fArray: this.fb.array([], Validators.required)
    })
  }

  get f2() { return this.formGroup2.controls; }
  get f2A() { return this.f2.fArray; }

  /**
   * Create item for fArray
   * @param item 
   * @returns 
   */
  public createItem(item: MatHang) {
    // Tính thành tiền trường hợp lần đàu hiển thị
    const calcInitThanhTien = (item) => {
      if (!item?.soLuong) {
        // Value
        const thanhTien = Number(item?.donGia) * 1;
        // Vat
        const vatPhaiTra = thanhTien * (Number(item?.vat) / 100);
        // Total
        return thanhTien + vatPhaiTra;
      } else {
        return 0;
      }
    }
    // Binding vào form
    return this.fb.group({
      matHangKey: [item?.matHangKey ?? '', Validators.required],
      donViTinhKey: [item?.donViTinhKey ?? '', Validators.required],
      soLuong: [item?.soLuong ?? 1, [Validators.required, Validators.min(1)]],
      donGia: [item?.donGia ?? 0],
      vat: [item?.vat ?? 0],
      thanhTien: [item?.thanhTien ?? calcInitThanhTien(item)],
      trangThaiMuaKey: [''],
      nguoiSuDungKeys: [item?.nguoiSuDungKeys ?? [], Validators.required],
      ghiChu: [item?.ghiChu ?? ''],
    });
  }

  /**
   * Add item
   */
  public addRow(item: MatHang) {
    (this.f2?.fArray as FormArray).push(this.createItem(item));
  }

  /**
   * Remove item
   * @param idx 
   */
  public removeRow(idx: number): void {
    (this.f2?.fArray as FormArray).removeAt(idx);
  }

  /**
   * Confirm remove and  unselect
   * @param idx 
   * @param matHangKey 
   */
  public confirmRemoveRow(idx: number, matHangKey: string): void {
    this.removeRow(idx);
    this.matHangs = this.matHangs.map((m: MatHang) => ({ ...m, checked: !(m.matHangKey === matHangKey) }));
    this.onSearchMatHang(null);
  }

  /**
   * Select checkbox all
   * @param e 
   */
  public selectAll(e: boolean, items: MatHang[] = []) {

    this.api.loadingCustomOn();

    this.matHangs.forEach((f, i) => this.matHangs[i].checked = e);

    setTimeout(() => {
      this.api.loadingCustomOff();
    }, 1000);

    if (e) {
      // Add all
      this.matHangs.forEach(m => this.addRow(m));
    } else {
      // Remove all
      this.initFormStep2();
    }
    this.onSearchMatHang(null);
  }

  /**
   * Select checkbox one
   * @param e 
   */
  public selectOne(e: boolean, item: MatHang) {

    this.api.loadingCustomOn();

    this.matHangs.forEach((f, i) => {
      if (item?.matHangKey === f?.matHangKey) {
        this.matHangs[i].checked = e;
      }
    })

    setTimeout(() => {
      this.api.loadingCustomOff();
    }, 500);

    if (e) {
      // Add row
      this.addRow(item);
    } else {
      // Remove row
      this.removeRow(this.f2A?.value?.findIndex((fi) => fi?.matHangKey === item?.matHangKey));
    }
    this.onSearchMatHang(null);
  }

  get isAllChecked() {
    return this.matHangs.find(f => f.checked === false) ? false : true;
  }

  /**
   * Submit create
   */
  public onCreate() {
    if (this.formGroup1.valid && this.formGroup2.valid) {
      const params = {
        ...this.formGroup1.value,
        hangs: this.f2A.value.map(m => ({
          matHangKey: m?.matHangKey,
          donViTinhKey: m?.donViTinhKey,
          soLuong: m?.soLuong,
          trangThaiMuaKey: m?.trangThaiMuaKey,
          nguoiSuDungKeys: m?.nguoiSuDungKeys,
          ghiChu: m?.ghiChu
        }))
      }
      this.api.post('/api/hoso-vanphongpham-create', params).subscribe(res => {
        if (res) {
          swal({
            icon: "success",
            title: 'Đăng ký văn phòng phẩm thành công!',
            buttons: {
              ok: this.translate.instant('COMMON.btn.close'),
            },
          } as any).then(() => {
            this.loadList.emit();
            this.cdf.detectChanges();
            this.removeDraft();
          });
        }
      }, err => this.api.errorMessage(err));
    }
  }

  /**
   * Submit edit
   */
  public onEdit() {
    if (this.formGroup1.valid && this.formGroup2.valid) {
      const params = {
        hoSoId: this.hoSoId,
        ghiChu: this.f1?.ghiChu?.value ?? '',
        hangs: this.f2A.value.map(m => ({
          matHangKey: m?.matHangKey,
          donViTinhKey: m?.donViTinhKey,
          soLuong: m?.soLuong,
          trangThaiMuaKey: m?.trangThaiMuaKey,
          nguoiSuDungKeys: m?.nguoiSuDungKeys,
          ghiChu: m?.ghiChu
        }))
      }
      this.api.put('/api/hoso-vanphongpham-update', params).subscribe(res => {
        if (res?.isSuccess) {
          swal({
            icon: "success",
            title: 'Cập nhật văn phòng phẩm thành công!',
            buttons: {
              ok: this.translate.instant('COMMON.btn.close'),
            },
          } as any).then(() => {
            this.isVisible = false;
            this.loadList.emit();
            this.cdf.detectChanges();
          });
        }
      }, err => this.api.errorMessage(err));
    }
  }

  /**
   * Next step >>
   * @param index 
   */
  public async nextStep(index) {
    this.formGroup1.markAllAsTouched();
    if ((index == 2 || index == 3) && this.formGroup1.invalid) {
      return;
    }

    this.formGroup2.markAllAsTouched();
    if (index == 4) {
      if (this.formGroup2.invalid) {
        return;
      }
      // Kiểm tra định mức 
      const checkDM = await this.checkDinhMuc();
      if (checkDM?.isSuccess === false) {
        this.api.errorMessage(checkDM?.messages[0]);
        return;
      }
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

  /**
   * Track FN
   * @param index 
   * @returns 
   */
  public trackByFn(index: number) {
    return index;
  }

  /**
   * Get khu vuc
   */
  public async getKhuVuc() {
    this.khuVucOptions = await this.api.get('/api/hoso-vanphongpham-dm/khu-vuc')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m?.khuVucKey, label: m?.khuVucDisplay })))))
      .toPromise();
  }

  /**
   * Get mat hang
   */
  public async getMatHang() {
    const res = await this.api.get('/api/hoso-vanphongpham-dm/mat-hang').toPromise();
    this.matHangs = res?.items?.map((m) => ({ ...m, checked: false }));
    this.matHangOptions = res?.items?.map((m: any) => ({ value: m?.matHangKey, label: m?.matHangDisplay }))
    this.donViTinhOptions = res?.items?.map((m: any) => ({ value: m?.donViTinhKey, label: m?.donViTinhDisplay }))
    this.onSearchMatHang(null);
  }

  /**
   * Get trạng thái mua
   */
  public getStatusMua() {
    this.api.get('/api/hoso-vanphongpham-dm/trang-thai-mua')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m?.trangThaiMuaKey, label: m?.trangThaiMuaDisplay })))))
      .subscribe(res => {
        if (res) {
          this.trangThaiMuas = res
        }
      })
  }

  /**
   * Get người sử dụng
   */
  public getNguoiSuDung() {
    this.api.get('/api/hoso-vanphongpham-dm/nguoi-su-dung')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m?.nguoiSuDungKey, label: m?.nguoiSuDungDisplay })))))
      .subscribe(res => {
        if (res) {
          this.nguoiSuDungOptions = res
        }
      })
  }

  /**
   * Get load thông tin update
   */
  public async loadUpdate(hoSoId: string) {
    this.step = 1;

    // Lấy thông tin update 
    this.dataDetail = await this.api.get('/api/hoso-vanphongpham-update', { hoSoId: hoSoId }).toPromise();

    // Binding form
    this.formGroup1.patchValue({
      khuVucKey: this.dataDetail?.khuVucKey,
      ghiChu: this.dataDetail?.ghiChu,
    });

    this.dataDetail?.hangs?.forEach(async task => {
      // Xử lý bất đồng bộ
      const matHang = await of(this.matHangs).pipe(map(m => m.find((f: any) => f?.matHangKey === task?.matHangKey))).toPromise();

      // Tính thành tiền + cả vat
      const calcInitThanhTien = (matHang) => {
        // Value
        const thanhTien = Number(matHang?.donGia) * Number(task?.soLuong);
        // Vat
        const vatPhaiTra = thanhTien * (Number(matHang?.vat) / 100);
        // Total
        return thanhTien + vatPhaiTra;
      }

      // Bindind data vào form dynamic
      (this.f2A as FormArray).push(this.createItem({
        ...task,
        donGia: matHang?.donGia,
        thanhTien: calcInitThanhTien(matHang),
        vat: matHang?.vat,
        nguoiSuDungKeys: task?.nguoiSuDungKeys ?? []
      }));
    });

    // Update checkbox
    this.matHangs.forEach((f, i) => {
      this.dataDetail?.hangs?.forEach(async task => {
        if (task?.matHangKey === f?.matHangKey) {
          this.matHangs[i].checked = true;
        }
      });
    });

    this.dataDetail?.hangs?.forEach(task => {
      this.matHangs = this.matHangs?.map((m) => ({ ...m, checked: (task.matHangKey === m.matHangKey) }));
    });
  }

  public handleCalc(item, i) {
    // Value
    const thanhTien = Number(item?.donGia) * Number(item?.soLuong);
    // Vat
    const vatPhaiTra = thanhTien * (Number(item?.vat) / 100);
    // Total
    const value = { ...item, thanhTien: thanhTien + vatPhaiTra };
    // Update data
    (this.f2A as FormArray)?.controls?.[i]?.patchValue(value);
  }

  get soLuongTotal() {
    return this.f2A?.value?.reduce(function (total, currentValue) { return Number(total) + Number(currentValue?.soLuong) }, 0) || 0;
  }

  get thanhTienTotal() {
    return this.f2A?.value?.reduce(function (total, currentValue) { return Number(total) + Number(currentValue?.thanhTien) }, 0) || 0;
  }

  public getDisplayName(originField, key) {
    return this[originField]?.find((f: Options) => f?.value === key)?.label;
  }

  public getDisplayNameByKeys(originField, keys: string[] = []) {
    let names: string[] = [];
    keys?.map(key => {
      const option = this[originField]?.find((f: Options) => f?.value === key);
      if (option) {
        names.push(option?.label);
      }
    })
    return names;
  }

  public onSearchMatHang(text): void {
    this.matHangsFound = this.matHangs.filter(m => text ? m?.matHangDisplay?.toLowerCase()?.includes(text?.toLowerCase()) : true);
  }

  public onChangeNguoiDung(e, idx) {
    this.f2A['controls'][idx]?.controls?.nguoiSuDungKeys?.setValue(e);
  }

  public async checkDinhMuc() {
    const param = this.f2A?.value?.map(m => {
      return {
        matHangKey: m?.matHangKey,
        donViTinhKey: m?.donViTinhKey,
        soLuong: m?.soLuong,
        trangThaiMuaKey: m?.trangThaiMuaKey,
        ghiChu: m?.ghiChu
      }
    })
    return await this.api.post('/api/hoso-vanphongpham-create/kiemtra-dinhmuc', param).toPromise();
  }

  public saveDraft() {
    const draft = {
      formGroup1: this.formGroup1.value,
      formGroup2: this.formGroup2.value,
      matHangs: this.matHangs,
    }
    this.isVisible = false;
    if (this.hoSoId) {
      this.removeDraft(); // Clear if edit mode
    } else {
      localStorage.setItem('STATIONERY_DRAFT', JSON.stringify(draft));
    }
  }

  private loadDraft() {
    const draft = JSON.parse(localStorage.getItem('STATIONERY_DRAFT'));
    if (draft) {
      this.formGroup1.patchValue(draft?.formGroup1);
      draft?.formGroup2?.fArray?.forEach(task => {
        (this.f2A as FormArray).push(this.createItem(task));
      });
      this.matHangs = draft?.matHangs;
      this.onSearchMatHang(null);
    }
  }

  public removeDraft() {
    this.isVisible = false;
    localStorage.removeItem('STATIONERY_DRAFT');
  }

}
