import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, of } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import serialize from "@octetstream/object-to-form-data";
import swal from 'sweetalert';

import { Options } from 'src/app/_metronic/shared/shared/models/options';
import { formatterInputNumber, parserInputNumber } from 'src/app/_metronic/shared/shared/common/helper';
import { AuthService, UserModel } from 'src/app/modules/auth';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import { SelectedFiles } from 'src/app/_metronic/shared/shared/services/files.service';

@Component({
  selector: 'app-requests-payment-create-modal',
  templateUrl: './requests-payment-create-modal.component.html',
  styleUrls: ['./requests-payment-create-modal.component.scss']
})
export class RequestsPaymentCreateModalComponent implements OnInit {

  @Output() loadList = new EventEmitter;

  // format input number
  public formatter = formatterInputNumber;
  public parser = parserInputNumber;

  public isVisible = false;
  public step: number;
  public today = new Date();
  public userInfo: UserModel;

  // Step 1
  public formGroup1: FormGroup;
  public soHopDongOptions: Options[] = [];
  public soHopDongOptionsFind: Options[] = [];
  public ycmhOptions: Options[] = [];
  public toTrinhOptions: Options[] = [];
  public khuVucOptions: Options[] = [];
  public loaiDeNghiKhuVucOptions: Options[] = [];
  public loaiDeNghiChiTietOptions: Options[] = [];
  public loaiDeNghiThanhToanOptions: Options[] = [];
  public deNghiTamUngOptions: Options[] = [];
  public nhaCungCapOptions: Options[] = [];
  public maSoThueOptionsFind: Options[] = [];
  // Step 2
  public formGroup2: FormGroup;
  public loaiNgoaiTeOptions: Options[] = [];
  public selectedFiles: SelectedFiles[] = [];
  public lichSus: any[] = [];
  // Step 3
  public formGroup3: FormGroup;
  public maChiPhiOptions: Options[] = [];
  public maChiTieuOptions: Options[] = [];

  public namOptions: Options[] = [];
  public thangOptions: Options[] = [];

  constructor(
    public api: ApiService,
    private fb: FormBuilder,
    private auth: AuthService,
    private translate: TranslateService
  ) {
  }

  ngOnInit() {
    //==== Init form ====//
    this.initForm1();
    this.initForm2();
    this.initForm3();
  }

  public async showModal(data?, mode?: string) {
    this.step = 1;
    this.isVisible = true;
    this.ngOnInit();

    //==== Load data ====//
    // Step 1
    this.getSoHopDongOptions();
    this.getYCMHOptions();
    this.getToTrinhOptions();
    this.getKhuVucOptions();
    this.getLoaiDeNghiThanhToanOptions();
    this.getDeNghiTamUngOptions();
    await this.getNhaCungCapOptions();
    // Step 2
    this.getNgoaiTeOptions();
    // Step 3
    this.getMaChiPhiOptions();
    this.getMaChiTieuOptions();
    this.getNamOptions();
    this.getThangOptions();
    // === Load draft === //
    this.loadDraft(data, mode);
    // Current user
    this.userInfo = this.auth.currentUserValue;
  }

  /**
   * Form group
   */
  public initForm1(): void {
    this.formGroup1 = this.fb.group({
      IsThanhToanCuoi: [false],
      SoHopDong: [],
      PhuLucHopDong: [],
      SoHoaDon: [],
      YeuCauMuaHangKey: [],
      ToTrinhKey: [],
      MaSoThue: [],
      NhaCungCapKey: [],
      // Loại đề nghị
      KhuVucKey: ['', Validators.required],
      LoaiDeNghiKhuVucKey: ['', Validators.required],
      LoaiDeNghiKhuVucChiTietKey: ['', Validators.required],
      LoaiHinhThanhToanKey: ['', Validators.required],
      // Hiển thị theo option
      DeNghiTamUngKey: [],
      SoTaiKhoan: [],
      TenTaiKhoan: [],
      TenNganHang: [],
      TenChiNhanh: [],
      // Noi dung
      NoiDungDeNghi: ['', Validators.required],
      NoiDungDeNghiEng: ['', Validators.required],
    })

    this.f1.LoaiDeNghiKhuVucKey.valueChanges.subscribe(value => {
      // Nếu là: Đề nghị thanh toán đại lý: value = 1 HaNoi value = 4 HCM (thì bỏ required)
      if (value) {
        if (value === '1' || value === '4') {
          this.f1.SoTaiKhoan.clearValidators(); // Don't required
          this.f1.TenTaiKhoan.clearValidators(); // Don't required
          this.f1.TenNganHang.clearValidators(); // Don't required
          this.f1.TenChiNhanh.clearValidators(); // Don't required
        } else {
          if (this.f1.LoaiHinhThanhToanKey.value === '2') {
            this.f1.SoTaiKhoan.setValidators([Validators.required]); // required
            this.f1.TenTaiKhoan.setValidators([Validators.required]); // required
            this.f1.TenNganHang.setValidators([Validators.required]); // required
            this.f1.TenChiNhanh.setValidators([Validators.required]); // required
          }
        }
        this.f1.SoTaiKhoan.updateValueAndValidity();
        this.f1.TenTaiKhoan.updateValueAndValidity();
        this.f1.TenNganHang.updateValueAndValidity();
        this.f1.TenChiNhanh.updateValueAndValidity();
      }
    });

    this.f1.LoaiHinhThanhToanKey.valueChanges.subscribe(value => {
      // Nếu là: Chuyển khoản: value = 2 (thì required)
      // Nếu là: Đề nghị thanh toán đại lý: value = 1 HaNoi value = 4 HCM (thì bỏ required)
      if (value) {
        if (value === '2' && (this.f1.LoaiDeNghiKhuVucKey.value !== '1' && this.f1.LoaiDeNghiKhuVucKey.value !== '4')) {
          this.f1.SoTaiKhoan.setValidators([Validators.required]); // required
          this.f1.TenTaiKhoan.setValidators([Validators.required]); // required
          this.f1.TenNganHang.setValidators([Validators.required]); // required
          this.f1.TenChiNhanh.setValidators([Validators.required]); // required
        } else {
          this.f1.SoTaiKhoan.clearValidators(); // Don't required
          this.f1.TenTaiKhoan.clearValidators(); // Don't required
          this.f1.TenNganHang.clearValidators(); // Don't required
          this.f1.TenChiNhanh.clearValidators(); // Don't required
        }
        this.f1.SoTaiKhoan.updateValueAndValidity();
        this.f1.TenTaiKhoan.updateValueAndValidity();
        this.f1.TenNganHang.updateValueAndValidity();
        this.f1.TenChiNhanh.updateValueAndValidity();
      }
    })

    // On change số hợp đồng
    this.f1.SoHopDong.valueChanges.subscribe(res => {
      this.lichSus = []; // clear
      this.f1.MaSoThue.reset(); // Clear
      if (res) {
        this.soHopDongOptionsFind = this.soHopDongOptions.filter(f => f?.value.includes(res));
        if (this.soHopDongOptions.find(f => f?.value === res)) {
          this.getLichSu(res);
        }
      }
    })

    // On change mã số thuế - "Mã số thuế/ Mã nhân viên" chính là nhaCungCapKey trong nhaCungCapOptions
    this.f1.MaSoThue.valueChanges.subscribe(res => {
      this.f1.NhaCungCapKey.reset(); // Clear
      if (res) {
        this.maSoThueOptionsFind = this.nhaCungCapOptions.filter(f => f?.value.includes(res));
        if (this.nhaCungCapOptions.find(f => f?.value === res)) {
          this.f1.NhaCungCapKey.setValue(this.getNameByDataOptions('nhaCungCapOptions', res)); // Tên nhà cũng cấp không đẩy vào API chỉ show để ng dùng thấy
        }
      }
    })
  }

  get f1() { return this.formGroup1.controls; }

  public initForm2(): void {
    this.formGroup2 = this.fb.group({
      IsNgoaiTe: [false],
      NgoaiTeKey: [],
      TyGia: [0, Validators.required],
      GiaTriHopDong: [0],
      GhiChu: [],
      GiaTriNgoaiTe: [0],
    });
    // On change
    this.f2.IsNgoaiTe.valueChanges.subscribe(res => {
      if (res) {
        this.f2.TyGia.setValidators(Validators.required);
      } else {
        this.f2.TyGia.setValue(0);
        this.f2.TyGia.clearValidators();
      }
      this.f2.TyGia.updateValueAndValidity();
    });
  }

  get f2() { return this.formGroup2.controls; }

  public initForm3(): void {
    this.formGroup3 = this.fb.group({
      fArray: this.fb.array([]),
      HoanUngVN: [0],
      HoanUngNT: [0],
      ChiThemVN: [0],
      ChiThemNT: [0]
    });
  }

  get f3() { return this.formGroup3.controls; }
  get f3A() { return this.f3.fArray; }

  /**
   * Create item for fArray
   * @param item 
   * @returns 
   */
  public createItem(item: any) {
    return this.fb.group({
      noiDungChiTiet: [item?.noiDungChiTiet ?? '', Validators.required],
      maChiPhiKey: [item?.maChiPhiKey ?? ''],
      maChiTieuKey: [item?.maChiTieuKey ?? ''],
      yeuCauMuaHangKey: [item?.yeuCauMuaHangKey ?? ''],
      yearPay: new Date().getFullYear(),
      monthPay: new Date().getMonth() + 1,
      soTienCoCTVN: [item?.soTienCoCTVN ?? 0],
      soTienCoCTNT: [item?.soTienCoCTNT ?? 0],
      soTienKhongCTVN: [item?.soTienKhongCTVN ?? 0],
      soTienKhongCTNT: [item?.soTienKhongCTNT ?? 0],
      ghiChu: [item?.ghiChu ?? ''],
      soTienCoCT: [item?.soTienCoCT ?? 0],
      soTienKhongCT: [item?.soTienKhongCT ?? 0],
    })
  }

  /**
   * Add item
   */
  public addRow(item: any) {
    (this.f3?.fArray as FormArray).push(this.createItem(item));
  }

  /**
   * Remove item
   * @param idx 
   */
  public removeRow(idx: number): void {
    if (idx > 0) {
      (this.f3?.fArray as FormArray).removeAt(idx);
    }
  }

  /**
   *  Load options
   */

  public getSoHopDongOptions() {
    this.api.get('/api/denghi-thanhtoan-daily-dm/so-hop-dong')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.soHopDong, label: m.soHopDong })))))
      .subscribe((res: any) => {
        if (res) {
          this.soHopDongOptions = res;
        }
      })
  }

  public getYCMHOptions() {
    this.api.get('/api/denghi-thanhtoan-daily-dm/ycms')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.ycmhKey, label: m.ycmhDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.ycmhOptions = res;
        }
      })
  }

  public getToTrinhOptions() {
    this.api.get('/api/denghi-thanhtoan-daily-dm/to-trinh')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.maChiPhiKey, label: m.maChiPhiDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.toTrinhOptions = res;
        }
      })
  }

  public getKhuVucOptions() {
    this.api.get('/api/denghi-thanhtoan-daily-dm/khu-vuc')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.khuVucKey, label: m.khuVucDisplay, code: m?.khuVucCode })))))
      .subscribe((res: any) => {
        if (res) {
          this.khuVucOptions = res;
        }
      })
  }

  public getLoaiDeNghiKhuVucOptions() {
    if (this.f1?.KhuVucKey?.value) {
      const queryParams = {
        khuVucKey: this.f1?.KhuVucKey?.value,
      }
      this.api.get('/api/denghi-thanhtoan-daily-dm/loai-de-nghi-khu-vuc', queryParams)
        .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.loaiDeNghiKhuVucKey, label: m.loaiDeNghiKhuVucDisplay, isActive: m?.isNeedTamUngInfo })))))
        .subscribe((res: any) => {
          if (res) {
            this.loaiDeNghiKhuVucOptions = res;
          }
        })
    }
  }

  public getLoaiDeNghiChiTietOptions() {
    if (this.f1?.KhuVucKey?.value && this.f1?.LoaiDeNghiKhuVucKey?.value) {
      const queryParams = {
        khuVucKey: this.f1?.KhuVucKey?.value,
        loaiDeNghiKhuVucKey: this.f1?.LoaiDeNghiKhuVucKey?.value,
      }
      this.api.get('/api/denghi-thanhtoan-daily-dm/loai-de-nghi-chi-tiet', queryParams)
        .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.loaiDeNghiKhuVucChiTietKey, label: m.loaiDeNghiKhuVucChiTietDisplay, quyTrinhId: m?.quyTrinhId })))))
        .subscribe((res: any) => {
          if (res) {
            this.loaiDeNghiChiTietOptions = res;
          }
        })
    }
  }

  public getLoaiDeNghiThanhToanOptions() {
    this.api.get('/api/denghi-thanhtoan-daily-dm/loai-hinh-thanh-toan')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.loaiHinhThanhToanKey, label: m.loaiHinhThanhToanDisplay, isActive: m?.isNeedNganHangInfo })))))
      .subscribe((res: any) => {
        if (res) {
          this.loaiDeNghiThanhToanOptions = res;
        }
      })
  }

  public getDeNghiTamUngOptions() {
    this.api.get('/api/denghi-thanhtoan-daily-dm/denghi-tam-ung')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m?.deNghiTamUngKey, label: m?.deNghiTamUngDisplay, tongTien: m?.tongTien })))))
      .subscribe((res: any) => {
        if (res) {
          this.deNghiTamUngOptions = res;
        }
      })
  }

  public getNgoaiTeOptions() {
    this.api.get('/api/denghi-thanhtoan-daily-dm/ngoai-te')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.ngoaiTeKey, label: m.ngoaiTeDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.loaiNgoaiTeOptions = res;
        }
      })
  }

  public getMaChiPhiOptions() {
    this.api.get('/api/denghi-thanhtoan-daily-dm/ma-chi-phi')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.maChiPhiKey, label: m.maChiPhiDisplay, code: m?.maChiPhiCode })))))
      .subscribe((res: any) => {
        if (res) {
          this.maChiPhiOptions = res;
        }
      })
  }

  public getMaChiTieuOptions() {
    this.api.get('/api/denghi-thanhtoan-daily-dm/ma-chi-tieu')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.maChiTieuKey, label: m.maChiTieuDisplay, code: m?.maChiTieuCode })))))
      .subscribe((res: any) => {
        if (res) {
          this.maChiTieuOptions = res;
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

  /**
   * Mã số thuế nằm trong api này
   */
  public async getNhaCungCapOptions() {
    this.nhaCungCapOptions = await this.api.get('/api/denghi-thanhtoan-daily-dm/nha-cung-cap').pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.nhaCungCapKey, label: m.nhaCungCapDisplay }))))).toPromise();
  }

  /**
   * Get histoty and Tax
   *  */
  public getLichSu(SoHopDong: string) {
    this.api.get('/api/denghi-thanhtoan-daily-create/thong-tin-hop-dong', { SoHopDong: SoHopDong })
      .subscribe((res: any) => {
        this.lichSus = res && res.lichSus ? res?.lichSus : [];
        // Update input MaSoThue + NhaCungCapKey
        if (res?.maSoThue && res?.maSoThue !== 'null') {
          this.f1.MaSoThue.setValue(res?.maSoThue); // Set MaSoThue
          this.f1.NhaCungCapKey.setValue(this.getNameByDataOptions('nhaCungCapOptions', res?.maSoThue)); // Set NhaCungCapKey
        }
      })
  }

  /**
   * Get total Số tiền
   */

  get totalSoTienCoCT() {
    return {
      vnd: this.f3A?.value?.reduce(function (total, current) { return Number(total) + Number(current?.soTienCoCTVN) }, 0) || 0,
      eur: this.f3A?.value?.reduce(function (total, current) { return Number(total) + Number(current?.soTienCoCTNT) }, 0) || 0,
    }
  }

  get totalSoTienKhongCoCT() {
    return {
      vnd: this.f3A?.value?.reduce(function (total, current) { return Number(total) + Number(current?.soTienKhongCTVN) }, 0) || 0,
      eur: this.f3A?.value?.reduce(function (total, current) { return Number(total) + Number(current?.soTienKhongCTNT) }, 0) || 0,
    }
  }

  get totalSoTien() {
    return {
      vnd: this.totalSoTienCoCT?.vnd + this.totalSoTienKhongCoCT?.vnd,
      eur: this.totalSoTienCoCT?.eur + this.totalSoTienKhongCoCT?.eur,
    }
  }

  public isActiveByDataOptions(dataName: string, key: string) {
    return this[dataName]?.find(f => f?.value === key)?.isActive;
  }

  public getNameByDataOptions(dataName: string, key: string) {
    return this[dataName]?.find(f => f?.value === key)?.label;
  }

  public getObjByDataOptions(dataName: string, key: string) {
    return this[dataName]?.find(f => f?.value === key);
  }

  /**
   * Action modal
   */

  public onSubmit(isApprove: boolean) {
    if (this.formGroup1.invalid || this.formGroup2.invalid || this.formGroup3.invalid || this.selectedFiles?.length === 0) {
      return false;
    }

    swal("Nhập pass code", {
      content: {
        element: "input",
        attributes: {
          placeholder: "Nhập pass code",
          type: "password",
          autocomplete: "off"
        },
      },
      buttons: {
        confirm: this.translate.instant('COMMON.btn.save'),
        cancel: this.translate.instant('COMMON.btn.cancel')
      },
    } as any)
      .then((passCode) => {
        // *********************
        // ***** PassCode ******
        // *********************
        if (passCode === null) {
          return; // reject
        }

        const params = {
          ...this.formGroup1.value,
          ...this.formGroup2.value,
          ...this.formGroup3.value,
          PassCode: passCode ?? ''
        };

        Object.keys(params).forEach(key => {
          if (!params[key] || params[key] === 'null') {
            params[key] = '';
          }
        })

        delete params.fArray;
        delete params.IsNgoaiTe;
        delete params.NhaCungCapKey;

        // False: Đề nghị hoàn ứng ?
        if (!this.isActiveByDataOptions('loaiDeNghiKhuVucOptions', this.f1?.LoaiDeNghiKhuVucKey?.value)) {
          delete params.DeNghiTamUngKey;
          delete params.HoanUngVN;
          delete params.ChiThemVN;
          // False: Thanh toán ngoại tệ ?
          if (!this.f2?.IsNgoaiTe?.value) {
            delete params.ChiThemNT;
            delete params.HoanUngNT;
          }
        }

        // False: Loại thanh toán chuyển khoản ?
        if (!this.isActiveByDataOptions('loaiDeNghiThanhToanOptions', this.f1?.LoaiHinhThanhToanKey?.value)) {
          delete params.SoTaiKhoan;
          delete params.TenTaiKhoan;
          delete params.TenNganHang;
          delete params.TenChiNhanh;
        }

        let chiTiets = [];
        chiTiets = this.f3A.value?.map(m => {
          return {
            noiDungChiTiet: m?.noiDungChiTiet,
            maChiPhiKey: m?.maChiPhiKey,
            maChiTieuKey: m?.maChiTieuKey,
            yearPay: new Date().getFullYear(),
            monthPay: new Date().getMonth() + 1,
            soTienCoCTVN: m?.soTienCoCTVN,
            soTienKhongCTVN: m?.soTienKhongCTVN,
            ghiChu: m?.ghiChu,
            soTienCoCTNT: m?.soTienCoCTNT,
            soTienKhongCTNT: m?.soTienKhongCTNT,
          }
        })
        // if (this.f2?.IsNgoaiTe?.value) {
        //   // True: Thanh toán ngoại tệ ?
        //   chiTiets = this.f3A.value?.map(m => {
        //     return {
        //       noiDungChiTiet: m?.noiDungChiTiet,
        //       maChiPhiKey: m?.maChiPhiKey,
        //       maChiTieuKey: m?.maChiTieuKey,
        //       yearPay: new Date().getFullYear(),
        //       monthPay: new Date().getMonth() + 1,
        //       soTienCoCTVN: m?.soTienCoCTVN,
        //       soTienKhongCTVN: m?.soTienKhongCTVN,
        //       ghiChu: m?.ghiChu,
        //       soTienCoCTNT: m?.soTienCoCTNT,
        //       soTienKhongCTNT: m?.soTienKhongCTNT,
        //     }
        //   })
        // } else {
        //   // False: Thanh toán ngoại tệ ?
        //   delete params.NgoaiTeKey;
        //   delete params.GiaTriNgoaiTe;
        //   chiTiets = this.f3A.value?.map(m => {
        //     return {
        //       noiDungChiTiet: m?.noiDungChiTiet,
        //       maChiPhiKey: m?.maChiPhiKey,
        //       maChiTieuKey: m?.maChiTieuKey,
        //       yearPay: new Date().getFullYear(),
        //       monthPay: new Date().getMonth() + 1,
        //       soTienCoCTVN: m?.soTienCoCTVN,
        //       soTienKhongCTVN: m?.soTienKhongCTVN,
        //       ghiChu: m?.ghiChu,
        //       soTienCoCTNT: 0,
        //       soTienKhongCTNT: 0,
        //     }
        //   });
        // }

        params.ChiTiets = chiTiets;

        let formData = serialize(params);

        this.selectedFiles.forEach(f => {
          formData.append('DinhKems', f?.file);
        });

        // Create
        this.api.post('/api/denghi-thanhtoan-daily-create', formData).subscribe(res => {
          // Message ok
          if (res?.isSuccess) {
            swal({
              icon: "success",
              title: 'Tạo đề nghị thanh toán/ tạm ứng thành công!',
              buttons: {
                ok: this.translate.instant('COMMON.btn.close'),
              },
            } as any).then(() => {
              this.reqSuccess();
            });
          } else {
            this.api.errorMessage('Tạo đề nghị thanh toán/ tạm ứng không thành công!');
          }
        }, err => {
          this.api.errorMessage(err);
        });
      });
  }

  /**
   * Steps switch
   */
  public nextStep(index) {
    // Touched form
    if (index === 2 && this.formGroup1.invalid) {
      this.formGroup1.markAllAsTouched();
      return;
    }
    if (index === 3 && (this.formGroup1.invalid || this.formGroup2.invalid || this.selectedFiles?.length === 0)) {
      this.formGroup2.markAllAsTouched();
      return;
    }
    if (index === 4 && (this.formGroup1.invalid || this.formGroup2.invalid || this.formGroup3.invalid || this.selectedFiles?.length === 0)) {
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

  public scroll(el?: HTMLElement, timeout = 0) {
    if (timeout) {
      setTimeout(() => {
        el && el.scrollIntoView();
      }, timeout);
    } else {
      el && el.scrollIntoView();
    }
  }

  public trackByFn(index: number) {
    return index;
  }

  /**
   * Draft 
   */

  public saveDraft() {
    this.selectedFiles = [];
    const formGroup3 = { ...this.formGroup3.value };
    delete formGroup3.fArray;
    const draft = {
      formGroup1: this.formGroup1.value,
      formGroup2: this.formGroup2.value,
      formGroup3: formGroup3,
      formGroup3_array: this.f3?.fArray.value,
    }
    localStorage.setItem('REQUESTS_PAYMENT_DRAFT', JSON.stringify(draft));
    this.isVisible = false;
  }

  private async loadDraft(data, mode) {
    if (mode === 'modeSaoChep') {
      const dataDetail = await this.api.get('/api/denghi-thanhtoan-daily-update', { HoSoId: data?.hoSoId }).toPromise();
      if (dataDetail) {
        // Load options
        dataDetail?.soHopDong && this.getLichSu(dataDetail?.soHopDong);
        // patchValue
        try {
          this.formGroup1.patchValue({
            IsThanhToanCuoi: dataDetail?.isThanhToanCuoi ?? false,
            SoHopDong: dataDetail?.soHopDong,
            PhuLucHopDong: dataDetail?.phuLucHopDong,
            SoHoaDon: dataDetail?.soHoaDon,
            YeuCauMuaHangKey: dataDetail?.yeuCauMuaHangKey,
            ToTrinhKey: dataDetail?.toTrinhKey,
            MaSoThue: dataDetail?.maSoThue,
            NhaCungCapKey: dataDetail?.nhaCungCapKey,
            // Loại đề nghị
            KhuVucKey: dataDetail?.khuVucKey,
            LoaiDeNghiKhuVucKey: dataDetail?.loaiDeNghiKhuVucKey,
            LoaiDeNghiKhuVucChiTietKey: dataDetail?.loaiDeNghiKhuVucChiTietKey,
            LoaiHinhThanhToanKey: dataDetail?.loaiHinhThanhToanKey,
            // Hiển thị theo option
            DeNghiTamUngKey: dataDetail?.deNghiTamUngKey,
            SoTaiKhoan: dataDetail?.soTaiKhoan ?? '',
            TenTaiKhoan: dataDetail?.tenTaiKhoan ?? '',
            TenNganHang: dataDetail?.tenNganHang ?? '',
            TenChiNhanh: dataDetail?.tenChiNhanh ?? '',
            // Noi dung
            NoiDungDeNghi: dataDetail?.noiDungDeNghi ?? '',
          });

          this.formGroup2.patchValue({
            IsNgoaiTe: dataDetail?.isNgoaiTe ?? false,
            NgoaiTeKey: dataDetail?.ngoaiTeKey,
            TyGia: dataDetail?.tyGia,
            GiaTriHopDong: dataDetail?.giaTriHopDong,
            GhiChu: dataDetail?.ghiChu,
            GiaTriNgoaiTe: dataDetail?.giaTriNgoaiTe,
          });

          this.formGroup3.patchValue({
            HoanUngVN: dataDetail?.hoanUngVN,
            HoanUngNT: dataDetail?.hoanUngNT,
            ChiThemVN: dataDetail?.chiThemVN,
            ChiThemNT: dataDetail?.chiThemNT,
          });

          dataDetail?.chiTiets?.forEach(task => {
            (this.f3A as FormArray).push(this.createItem(task));
          });

          this.getLoaiDeNghiKhuVucOptions();
          this.getLoaiDeNghiChiTietOptions();
        } catch (error) { }
      } else {
        (this.f3A as FormArray).push(this.createItem(null));
      }
    } else {
      const draft = JSON.parse(localStorage.getItem('REQUESTS_PAYMENT_DRAFT'));
      if (draft) {
        // Load options
        const shd = draft?.formGroup1?.SoHopDong;
        shd && this.getLichSu(draft?.formGroup1?.SoHopDong);
        // patchValue
        try {
          draft?.formGroup1 && this.formGroup1.patchValue(draft?.formGroup1);
          draft?.formGroup2 && this.formGroup2.patchValue(draft?.formGroup2);
          draft?.formGroup3 && this.formGroup3.patchValue(draft?.formGroup3);
          draft?.formGroup3_array?.forEach(task => {
            (this.f3A as FormArray).push(this.createItem(task));
          });

          this.getLoaiDeNghiKhuVucOptions();
          this.getLoaiDeNghiChiTietOptions();
        } catch (error) { }
      } else {
        (this.f3A as FormArray).push(this.createItem(null));
      }
    }
  }

  private reqSuccess() {
    this.isVisible = false;
    this.loadList.emit();
    this.removeDraft();
  }

  public removeDraft() {
    localStorage.removeItem('REQUESTS_PAYMENT_DRAFT');
  }
}

