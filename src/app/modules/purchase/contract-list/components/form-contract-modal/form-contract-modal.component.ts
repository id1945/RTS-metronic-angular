import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { debounceTime, distinct, switchMap } from 'rxjs/operators';
import { BehaviorSubject, of } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import swal from 'sweetalert';
import { formatterInputNumber, parserInputNumber, scrollEl } from 'src/app/_metronic/shared/shared/common/helper';
import { DinhKems, DuThaoHopDongs, PurchaseContactCreate } from '../../models/purchase-contact-create.model';
import { HangHoas } from './../../models/purchase-contact-create.model';
import { Options } from 'src/app/_metronic/shared/shared/models/options';
import { SelectedFiles } from 'src/app/_metronic/shared/shared/services/files.service';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';

@Component({
  selector: 'app-form-contract-modal',
  templateUrl: './form-contract-modal.component.html',
  styleUrls: ['./form-contract-modal.component.scss'],
  exportAs: 'form-contract'
})
export class FormContractModalComponent implements OnInit {

  @Output() loadList = new EventEmitter;

  // format input number
  public formatter = formatterInputNumber;
  public parser = parserInputNumber;

  public isVisible = false;
  public step: number;
  public today = new Date();

  // Step 1
  public formGroup1: FormGroup;
  public idYCMHOptions: Options[] = [];
  public toTrinhNoiBoOptions: Options[] = [];
  public nhaCungCapDeSuatOptions: Options[] = [];
  public daiDienMuaHangOptions: Options[] = [];
  public nguoiCanDuyetOptions: Options[] = [];
  public nguoiNhanThongBaoOptions: Options[] = [];
  public searchIdYCMHDelay = new BehaviorSubject(null);
  public searchNhaCungCapDeSuat = new BehaviorSubject(null);

  // Step 2
  public formGroup2: FormGroup;
  public loaiHopDongOptions: Options[] = [];
  public doiTacKyHopDongOptions: Options[] = [];
  public giaTriHopDongOptions: Options[] = [];

  // Step 3
  public showFormNo = 0;
  public formGroup3: FormGroup;
  public formGroup4: FormGroup;
  public formGroup5: FormGroup;
  public formGroup6: FormGroup;
  public hangHoaOptions: Options[] = [];
  public nhaCungCapOptions: Options[] = [];
  public dataTableHangHoas: HangHoas[] = [];
  // Dự thảo hợp đồng
  public dataTableDuThaoHopDongs: DuThaoHopDongs[] = [];
  // Tài liệu đính kèm
  public dataTableDinhKems: DinhKems[] = [];
  // Select files
  public loaiTaiLieuOptions: Options[] = [];
  public selectedFiles: SelectedFiles[] = [];

  constructor(
    public api: ApiService,
    private translate: TranslateService,
  ) { }

  ngOnInit(): void {
    this.initForm1();
    this.initForm2();
    this.initForm3();
    this.initForm4();
    this.initForm5();
    this.initForm6();
  }

  public showModal(data?, mode?: string) {
    this.step = 1;
    this.isVisible = true;
    this.ngOnInit();
    // Load options
    // Step 1
    this.getIdYCMHOptions();
    this.getToTrinhNoiBoOptions();
    this.getNhaCungCapDeSuatOptions();
    this.getBoPhanYCMSOptions();
    this.getNguoiCanDuyetOptions();
    this.getNguoiNhanThongBaoOptions();
    // Step 2
    this.getLoaiHopDongOptions();
    this.getDoiTacKyHopDongOptions();
    this.getGiaTriHopDong();
    // Step 3
    this.getBoPhanYCMSOptions();
    this.getLoaiTaiLieu();
  }

  private initForm1() {
    this.formGroup1 = new FormGroup({
      idYCMHs: new FormControl(null),
      toTrinhNoiBoKey: new FormControl(null),
      idDeXuatLuaChonNCCs: new FormControl(null),
      isBoPhanTuMua: new FormControl(false),
      nguoiCanDuyetKeys: new FormControl(null, Validators.required),
      nguoiNhanThongBaoKeys: new FormControl(null),
    });
    // On change - Binding Người cần duyệt
    this.f1?.idYCMHs?.valueChanges?.subscribe(idYCMHs => {
      let boPhanDongTrinh: any[] = [];
      idYCMHs?.forEach(async idYCMH => {
        await this.api.get('/api/purchase-product-detail', { idYCMH: idYCMH })
          .pipe(switchMap(s => this.api.get('/api/totrinh-duyetchi-detail', { HoSoId: s?.toTrinhNoiBoKey })))
          .toPromise().then(res => {
            boPhanDongTrinh = [...boPhanDongTrinh, ...res?.boPhanDongTrinh?.items];
            const keys = this.nguoiCanDuyetOptions.filter(f1 => boPhanDongTrinh.find(f2 => f1?.meta?.tenDangNhap === f2?.tenDangNhap)).map(m => m?.value);
            this.f1.nguoiCanDuyetKeys.setValue(keys);
          });
      });
    })
  }

  private initForm2() {
    this.formGroup2 = new FormGroup({
      soHopDong: new FormControl('', Validators.required),
      loaiHopDongKey: new FormControl(null, Validators.required),
      giaTriHopDongKey: new FormControl(''),
      dieuKienThanhToan: new FormControl('', Validators.required),
      baoHanh: new FormControl(''),
      baoLanh: new FormControl(''),
      doiTacKyHopDongKey: new FormControl(null, Validators.required),
      noiDung: new FormControl(''),
      ghiChu: new FormControl(''),
    });
    // On change
    this.f2.loaiHopDongKey.valueChanges.subscribe(key => {
      // Nếu là Hợp đồng nguyên tắc thì được phép lựa chọn Giá trị hợp đồng
      // Nếu không phải thì remove
      if (key !== 'contract_principle') {
        this.f2.giaTriHopDongKey.setValue('');
      }
    })
  }

  private initForm3() {
    this.formGroup3 = new FormGroup({
      hangHoaKey: new FormControl(null, Validators.required),
      quyCach: new FormControl('', Validators.required),
      dvt: new FormControl(''),
      soLuong: new FormControl(0, Validators.required),
      donGiaChuaVAT: new FormControl(0, Validators.required),
      thanhTienChuaVAT: new FormControl(0),
      ghiChu: new FormControl(''),
    });
    this.f3.hangHoaKey.valueChanges.subscribe(hangHoaKey => this.f3.dvt.setValue(this.getObjOptions('hangHoaOptions', hangHoaKey)?.meta?.dvt ?? ''));
    this.f3.hangHoaKey.valueChanges.subscribe(hangHoaKey => this.f3.donGiaChuaVAT.setValue(this.getObjOptions('hangHoaOptions', hangHoaKey)?.meta?.giaThamKhao ?? 0));
    this.f3.soLuong.valueChanges.subscribe((soLuong) => this.f3.thanhTienChuaVAT.setValue(soLuong * this.f3?.donGiaChuaVAT?.value));
    this.f3.donGiaChuaVAT.valueChanges.subscribe((donGiaChuaVAT) => this.f3.thanhTienChuaVAT.setValue(donGiaChuaVAT * this.f3?.soLuong?.value));
  }

  private initForm4() {
    this.formGroup4 = new FormGroup({
      taiLieuDinhKemKey: new FormControl(null),
      ghiChu: new FormControl(''),
      // files: []
    });
  }

  private initForm5() {
    this.formGroup5 = new FormGroup({
      taiLieuDinhKemKey: new FormControl(null),
      ghiChu: new FormControl(''),
      // files: []
    });
  }

  private initForm6() {
    this.formGroup6 = new FormGroup({
      giamGia: new FormControl(0, Validators.required),
      vat: new FormControl(0, Validators.required),
    });
  }

  get f1() { return this.formGroup1.controls; }
  get f2() { return this.formGroup2.controls; }
  get f3() { return this.formGroup3.controls; }
  get f4() { return this.formGroup4.controls; }
  get f5() { return this.formGroup5.controls; }
  get f6() { return this.formGroup6.controls; }

  /**
   * Xoá bản ghi trên table
   */
  public onDeleteRowTable(dataName: string, index: number) {
    this[dataName] = this[dataName]?.filter((f, i) => i !== index);
  }

  /**
   * Step 3
   * Form 1
   * @param scollEl 
   */
  public onThemThongTin(scollEl: HTMLElement) {
    this.formGroup3.markAllAsTouched();
    if (this.formGroup3.valid) {
      scrollEl(scollEl, 500);
      this.dataTableHangHoas.push(this.formGroup3.value);
      this.initForm3();
      this.showFormNo = 0;
    }
  }

  /**
   * Step 3
   * Form 2
   * @param scollEl 
   */
  public onThemDTHopDong(scollEl: HTMLElement) {
    this.formGroup4.markAllAsTouched();
    if (this.formGroup4.valid && this.selectedFiles.length) {
      scrollEl(scollEl, 500);
      this.dataTableDuThaoHopDongs.push({
        ...this.formGroup4.value,
        files: this.selectedFiles.map((m: SelectedFiles) => ({ fileName: m.name, fileContentBase64: m.base64Content, base64: m.base64 }))
      });
      this.formGroup4.reset();
      this.selectedFiles = [];
      this.showFormNo = 0;
    }
  }

  /**
   * Step 3
   * Form 3
   * @param scollEl 
   */
  public onThemTLDinhKem(scollEl: HTMLElement) {
    this.formGroup5.markAllAsTouched();
    if (this.formGroup5.valid && this.selectedFiles.length) {
      scrollEl(scollEl, 500);
      this.dataTableDinhKems.push({
        ...this.formGroup5.value,
        files: this.selectedFiles.map((m: SelectedFiles) => ({ fileName: m.name, fileContentBase64: m.base64Content, base64: m.base64 }))
      });
      this.formGroup5.reset();
      this.selectedFiles = [];
      this.showFormNo = 0;
    }
  }

  /**
   * POST
   */
  public onSubmit() {
    const body = {
      ...this.formGroup1.value,
      ...this.formGroup2.value,
      ...this.formGroup6.value,
      hangHoas: this.dataTableHangHoas.map(m => { delete m.dvt; return m }),
      duThaoHopDongs: this.dataTableDuThaoHopDongs.map(m0 => ({ ...m0, files: m0.files.map(m1 => { delete m1.base64; return m1 }) })),
      dinhKems: this.dataTableDinhKems.map(m0 => ({ ...m0, files: m0.files.map(m1 => { delete m1.base64; return m1 }) })),
    } as PurchaseContactCreate;
    // Request
    this.api.post('/api/purchase-contract-create', body).subscribe(res => {
      if (res?.isSuccess) {
        swal({
          icon: 'success',
          title: `Thêm mới đề nghị ký hợp đồng thành công!`,
          buttons: {
            ok: this.translate.instant('COMMON.btn.close'),
          },
        } as any).then(() => {
          this.isVisible = false;
          this.loadList.emit();
        });
      } else {
        this.api.errorMessage('Thêm mới đề nghị ký hợp đồng không thành công!');
      }
    }, err => {
      this.api.errorMessage(err);
    });
  }

  /**
   * ************************
   * ******** STEP 1 ********
   * ************************
   */
  private getIdYCMHOptions() {
    this.searchIdYCMHDelay.pipe(debounceTime(1000)).subscribe((text) => {
      const query = {
        SearchText: text,
        SortField: 'ngayTao',
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
      SortField: 'ngayTao',
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

  public getNhaCungCapDeSuatOptions() {
    this.searchNhaCungCapDeSuat.pipe(debounceTime(1000)).subscribe((text) => {
      const query = {
        SearchText: text,
        SortField: 'ngayTao',
        SortOrder: 'asc',
        Page: 1,
        ItemsPerPage: 20
      }
      this.api.get('/api/purchase-requisition-list', query)
        .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.idDeXuat, label: m.soDeXuat, meta: m })))))
        .subscribe((res: any) => {
          if (res) {
            this.nhaCungCapDeSuatOptions = res;
          }
        });
    });
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

  /**
   * ************************
   * ******** STEP 2 ********
   * ************************
   */
  private getLoaiHopDongOptions() {
    this.api.get('/api/purchase-contract-dm/loai-hop-dong')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.loaiHopDongKey, label: m.loaiHopDongDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.loaiHopDongOptions = res;
        }
      })
  }

  private getDoiTacKyHopDongOptions() {
    this.api.get('/api/purchase-contract-dm/doi-tac-ky-hop-dong')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.doiTacKyHopDongKey, label: m.doiTacKyHopDongDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.doiTacKyHopDongOptions = res;
        }
      })
  }

  /**
   * ************************
   * ******** STEP 3 ********
   * ************************
   */
  private getBoPhanYCMSOptions() {
    this.api.get('/api/purchase-danh-muc/hang-hoa')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.hangHoaKey, label: m.hangHoaDisplay, meta: m })))))
      .subscribe((res: any) => {
        if (res) {
          this.hangHoaOptions = res;
        }
      })
  }

  public getLoaiTaiLieu() {
    this.api.get('/api/purchase-danh-muc/tai-lieu-dinh-kem')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.taiLieuDinhKemKey, label: m.taiLieuDinhKemDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.loaiTaiLieuOptions = res;
        }
      })
  }

  public getGiaTriHopDong() {
    this.api.get('/api/purchase-contract-dm/gia-tri-hop-dong')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.giaTriHopDongKey, label: m.giaTriHopDongDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.giaTriHopDongOptions = res;
        }
      })
  }

  public loaiTaiLieuRequired() {
    swal({
      icon: 'warning',
      title: this.translate.instant('PURCHASE.CREATE.step_1.form.attachments.required'),
      buttons: {
        confirm: this.translate.instant('COMMON.btn.close'),
      },
    } as any);
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
    return [...this.dataTableHangHoas]?.map(m => m.thanhTienChuaVAT)?.reduce((total: number, currentValue: number) => (total + currentValue), 0) ?? 0;
  }

  get tongDaCoVAT() {
    return (this.tongChuaVAT - this.f6.giamGia.value + this.f6.vat.value) ?? 0;
  }

  public trackByFn(index: number, item: any) {
    return index;
  }

  public nextStep(index) {
    // Touched form
    if (index === 2 && this.formGroup1.invalid) {
      this.formGroup1.markAllAsTouched();
      return;
    }
    if (index === 3 && (this.formGroup1.invalid || this.formGroup2.invalid)) {
      this.formGroup2.markAllAsTouched();
      return;
    }
    if (index === 4 && (this.formGroup1.invalid || this.formGroup2.invalid || this.dataTableHangHoas.length === 0 || this.dataTableDuThaoHopDongs.length === 0)) {
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
