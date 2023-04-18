import { AuthService } from 'src/app/modules/auth';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { switchMap, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import swal from 'sweetalert';
import uniqBy from 'lodash-es';

import { ThongTinHangHoaDichVus } from '../models/purchase-detail.model';
import { Options } from 'src/app/_metronic/shared/shared/models/options';
import { TableFullModalComponent } from '../purchase-detail/table-full-modal/table-full-modal.component';
import { configTextEditor, formatterInputNumber, isNumber, parserInputNumber, scrollEl } from 'src/app/_metronic/shared/shared/common/helper';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import { SelectedFiles } from 'src/app/_metronic/shared/shared/services/files.service';

@Component({
  selector: 'app-purchase-form-modal',
  templateUrl: './purchase-form-modal.component.html',
  styleUrls: ['./purchase-form-modal.component.scss']
})
export class PurchaseFormModalComponent implements OnInit {
  @Output() loadList = new EventEmitter;
  @Input() public isVisible = false;
  @ViewChild('tableFullModal', { static: false }) tableFullModal: TableFullModalComponent;

  // format input number
  public formatter = formatterInputNumber;
  public parser = parserInputNumber;
  // Config TextEditor
  public config = configTextEditor;

  public step: number;
  public today = new Date();
  public scrollEl = scrollEl;

  // Step 1
  public formGroup1: FormGroup;
  public toTrinhNoiBoOptions: Options[] = [];
  public loaiNghiepVuOptions: Options[] = [];
  public LoaiTaiLieuOptions: Options[] = [];
  public LoaiTaiLieuOptionsSelected: string;
  public selectedFiles: SelectedFiles[] = [];
  public selectedFilesDetail: SelectedFiles[] = [];
  public kieuMuaSamOptions: Options[] = [
    { value: 'one', label: 'Mua sự vụ' },
    { value: 'many', label: 'Mua nhiều lần' }
  ];

  // Step 2
  public formGroup2: FormGroup;
  public targetFromHangHoaDVData: any;
  public hangHoaDVOptions: Options[] = [];
  public maNganSachOptions: Options[] = [];
  public nhaCungCapDeSuatOptions: Options[] = [];
  public nhaCungCapDeSuatCDOptions: Options[] = [];
  public hangHoaDVData: ThongTinHangHoaDichVus[] = [];
  public hangHoaDVSelected: { index: number };
  public isBuggeValid = true;
  public soLuongNCCToiThieu = 0;
  public soLuongNCCToiThieuOriginFormApi: number;
  public isSpinning = false;
  public isFormHangHoaDV = false;

  public namOptions: Options[] = [];
  public thangOptions: Options[] = [];

  // Step 3
  public boPhanLienQuanOptions: Options[] = []
  public boPhanChuyenMonLQData: Options[] = [];
  public selectBoPhanChuyenMonLQ: string;

  // Step 4
  public userInfo: any;

  // Edit mode
  public dataRow: any;

  constructor(
    public api: ApiService,
    private fb: FormBuilder,
    private auth: AuthService,
    private cdf: ChangeDetectorRef,
    private translate: TranslateService,
  ) {
  }

  ngOnInit() {
    // Form step 1
    this.initForm1();
    // Form step 2
    this.initForm2();
    // Step 4
    this.userInfo = this.auth.currentUserValue;
  }

  /**
   * Step 1
   * Init or reset FormGroup
   */
  private initForm1() {
    this.formGroup1 = this.fb.group({
      toTrinhNoiBoKey: [null],
      ghiChu: [''],
      ghiChuEng: [''],
      loaiNghiepVuKey: [null, Validators.required],
      mucDich: ['', Validators.required],
      mucDichEng: ['', Validators.required],
      kieuMuaSamKey: [null, Validators.required],
    })
  }

  get f1() { return this.formGroup1.controls; }

  /**
   * Step 2
   * Init or reset FormGroup
   */
  private initForm2() {
    // Flag
    this.isSpinning = false;
    this.isBuggeValid = false; // check vượt ngân sách
    this.isFormHangHoaDV = false;
    this.hangHoaDVSelected = null;
    // FormGroup
    this.formGroup2 = this.fb.group({
      hangHoaKey: [null, Validators.required],
      soLuong: [0, Validators.required],
      giaDuToan: [0, Validators.required],
      giaThamKhao: [0], // soLuong * giaDuToan
      dvt: [''],
      ngayMongMuon: ['', Validators.required],
      nganSachKey: [null, Validators.required],
      yearPay: [null],
      monthPay: [null],
      isChiDinhNCC: [false],
      nhaCungCapDeXuatKeys: [],
      ghiChu: [''],
      ghiChuEng: [''],
      quyCach: [''],
      quyCachEng: [''],
      isBoPhanTuMua: [false],
    })
    this.f2?.hangHoaKey?.valueChanges.subscribe((value) => {
      const price = this.hangHoaDVOptions.find(f => f.value === value);
      if (price) {
        this.f2['dvt'].patchValue(price?.dvt);
        this.f2['giaThamKhao'].patchValue(Math.floor(Number(price?.giaThamKhao)));
      }
    });
    this.f2?.soLuong?.valueChanges.subscribe((value) => {
      const cost = Number(value) * (this.f2?.giaDuToan?.value);
      this.f2['giaThamKhao'].patchValue(Math.floor(cost));
    });
    this.f2?.giaDuToan?.valueChanges.subscribe((value) => {
      const cost = Number(value) * (this.f2?.soLuong?.value);
      this.f2['giaThamKhao'].patchValue(Math.floor(cost));
    });
  }

  get f2() { return this.formGroup2.controls; };

  public trackByFn(index: number, item: any) {
    return index;
  }

  /**
   * SHOW MODAL
   * @param data 
   */
  public async showModal(data = null) {
    this.step = 1;
    this.dataRow = data;
    this.ngOnInit();
    this.isVisible = true;
    this.selectBoPhanChuyenMonLQ = null;
    this.hangHoaDVData = [];
    this.selectedFiles = [];
    this.selectedFilesDetail = [];
    this.boPhanChuyenMonLQData = [];
    // Await
    await this.getNhaCungCapDeSuatOptions();
    // Binding
    this.loadDraft();
    // Load data dropbox
    this.getToTringNoiBoOptions();
    this.getLoaiNghiepVuOptions();
    this.getLoaiTaiLieu();
    this.getHangHoaDichVuOptions();
    this.getMaNganSachOptions();
    this.getNamOptions();
    this.getThangOptions();
    this.getBoPhanLienQuanOptions();
  }

  /**
   * CREATE
   * @param isApprove 
   * @returns 
   */
  public onCreate(isApprove: boolean) {
    if (this.formGroup1.invalid || this.hangHoaDVData.length === 0) {
      return;
    }
    // Hàng hoá
    const hangHoas = this.hangHoaDVData?.map(m => {
      return {
        hangHoaKey: m.hangHoaKey,
        soLuong: m.soLuong,
        giaDuToan: m.giaDuToan,
        giaThamKhao: m.giaThamKhao, // soLuong * giaDuToan
        ngayMongMuon: m.ngayMongMuon.toString().length === 10 ? m.ngayMongMuon : Math.floor(new Date(m.ngayMongMuon).getTime() / 1000),
        nganSachKey: m.nganSachKey,
        yearPay: m?.yearPay,
        monthPay: m?.monthPay,
        isChiDinhNCC: m.isChiDinhNCC ? true : false,
        nhaCungCapDeXuatKeys: m.nha_ccdx_keys ?? [],
        quyCach: m.quyCach,
        quyCachEng: m.quyCachEng,
        ghiChu: m.ghiChu,
        ghiChuEng: m.ghiChuEng,
        isBoPhanTuMua: m.isBoPhanTuMua
      }
    })

    // Bộ phận chuyên môn
    const bpcmlq = this.boPhanChuyenMonLQData.map(m => m.value);

    // File đính kèm
    const dinhKems = uniqBy(this.selectedFiles, 'attachKey').map((m: SelectedFiles) => {
      return {
        taiLieuDinhKemKey: m?.attachKey ?? '',
        ghiChu: '',
        ghiChuEng: '',
        files: this.selectedFiles?.filter(f => f?.attachKey === m?.attachKey).map(m => ({
          fileName: m?.name,
          fileContentBase64: m?.base64Content
        }))
      }
    });

    const params = {
      ...this.formGroup1.value,
      createDate: Math.floor(new Date().getTime() / 1000),
      hangHoas: hangHoas,
      boPhanLienQuanKey: bpcmlq,
      dinhKems: dinhKems
    };

    // Create
    this.api.loadingCustomOn(); // Custom loading on
    this.api.post('/api/purchase-product-create', params).subscribe(res => {
      if (res) {
        if (isApprove) {
          this.approve(res, 'Tạo mới');
        } else {
          // Message ok
          this.api.loadingCustomOff(); // Custom loading off
          swal({
            icon: 'success',
            title: 'Đã tạo mới bản nháp',
            buttons: {
              ok: this.translate.instant('COMMON.btn.close'),
            },
          } as any).then(() => {
            this.reqSuccess();
          });
        }
      } else {
        this.api.errorMessage('Tạo mới bản nháp không thành công!');
      }
    }, err => {
      this.api.errorMessage(err);
    });
  }

  /**
   * EDIT
   * @param isApprove 
   * @returns 
   */
  public onEdit(isApprove: boolean) {
    if (this.formGroup1.invalid || this.hangHoaDVData.length === 0) {
      return;
    }
    // Hàng hoá
    const hangHoas = this.hangHoaDVData?.map(m => {
      return {
        hangHoaId: m?.hangHoaId,
        hangHoaKey: m?.hangHoaKey,
        soLuong: m?.soLuong,
        giaDuToan: m?.giaDuToan,
        giaThamKhao: m?.giaThamKhao, // soLuong * giaDuToan
        nganSachKey: m?.nganSachKey,
        yearPay: m?.yearPay,
        monthPay: m?.monthPay,
        quyCach: m?.quyCach,
        ghiChu: m?.ghiChu,
        isBoPhanTuMua: m?.isBoPhanTuMua,
        ghiChuEng: m?.ghiChuEng ?? '',
        quyCachEng: m?.quyCachEng ?? '',
        ngayMongMuon: m.ngayMongMuon.toString().length === 10 ? m.ngayMongMuon : Math.floor(new Date(m.ngayMongMuon).getTime() / 1000),
        isChiDinhNCC: m.isChiDinhNCC ? true : false,
        nhaCungCapDeXuatKeys: m.nha_ccdx_keys ?? [],
      };
    })
    // Bộ phận liên quan
    const bpcmlq = this.boPhanChuyenMonLQData.map(m => m.value);

    // File đính kèm    
    const dinhKems = uniqBy(this.selectedFiles, 'attachKey').map((m: SelectedFiles) => {
      return {
        taiLieuDinhKemKey: m?.attachKey ?? '',
        ghiChu: '',
        ghiChuEng: '',
        files: this.selectedFiles?.filter(f => f?.attachKey === m?.attachKey).map(m => ({
          fileName: m?.name,
          fileContentBase64: m?.base64Content
        }))
      }
    });

    const params = {
      ...this.formGroup1.value,
      createDate: Math.floor(new Date().getTime() / 1000),
      hangHoas: hangHoas,
      boPhanLienQuanKey: bpcmlq,
      id: this.dataRow?.id,
      dinhKems: dinhKems
    };

    // Edit
    this.api.loadingCustomOn(); // Custom loading on
    this.api.post('/api/purchase-product-update', params).subscribe(res => {
      if (res) {
        if (isApprove) {
          this.approve(res, 'Cập nhật');
        } else {
          // Message ok
          this.api.loadingCustomOff(); // Custom loading off
          swal({
            icon: 'success',
            title: 'Đã cập nhật bản nháp!',
            buttons: {
              ok: this.translate.instant('COMMON.btn.close'),
            },
          } as any).then(() => {
            this.reqSuccess();
          });
        }
      } else {
        this.api.errorMessage('Cập nhật bản nháp không thành công!');
      }
    }, err => {
      this.api.errorMessage(err);
    });
  }

  /**
   * Approve
   * @param res 
   */
  private approve(res, mode: string) {
    const formData = new FormData();
    formData.append('idYCMH', res.yeuCauMuaHangId);
    formData.append('maYCMH', res.maThamChieu);
    formData.append('action', 'Accept');
    this.api.post('/api/purchase-product-update/approve', formData).subscribe(res => {
      this.api.loadingCustomOff(); // Custom loading off
      if (res) {
        swal({
          icon: 'success',
          title: `${mode} và phê duyệt yêu cầu mua sắm thành công!`,
          buttons: {
            ok: this.translate.instant('COMMON.btn.close'),
          },
        } as any).then(() => {
          this.reqSuccess();
        });
      } else {
        swal({
          icon: "warning",
          title: `${mode} bản nháp thành công! Phát hiện lỗi trong quá trình phê duyệt!`,
          buttons: {
            ok: this.translate.instant('COMMON.btn.close'),
          },
        } as any).then(() => {
          this.reqSuccess();
        });
      }
    }, err => {
      this.api.loadingCustomOff(); // Custom loading off
      swal({
        icon: "warning",
        title: `${mode} bản nháp thành công! Phát hiện lỗi trong quá trình phê duyệt! ` + JSON.stringify(err),
        buttons: {
          ok: this.translate.instant('COMMON.btn.close'),
        },
      } as any).then(() => {
        this.reqSuccess();
      });
    });
  }

  /**
   * Edit HangHoaDV
   * @param item 
   * @param index 
   */
  public onEditHHDV(item, index: number) {
    this.isFormHangHoaDV = true;
    this.hangHoaDVSelected = { index };
    // Binding data to form
    this.formGroup2.patchValue(item);
  }

  /**
   * Create thông tin hàng hoá dv
   */
  async onSubmitHangHoaDV(scollEl: HTMLElement) {
    // Form invalid
    if (this.formGroup2.invalid) {
      this.formGroup2.markAllAsTouched();
      return
    }

    this.isSpinning = true;

    // check vượt ngân sách
    let checkBugge = null;
    await this.checkNganSach().then(res => checkBugge = res).catch(err => this.api.errorMessage(err));
    this.isBuggeValid = checkBugge?.result ?? false;

    // check chỉ định nhà cung cấp - [Phải có nhiều nhà cung cấp nếu đơn hàng mua quá lớn, đó là điều cần check ở đây]
    let soLuongNCCToiThieu = null;
    await this.checkNhaCungCap().then(res => soLuongNCCToiThieu = res).catch(err => this.api.errorMessage(err));
    this.soLuongNCCToiThieuOriginFormApi = soLuongNCCToiThieu?.soLuongNCCToiThieu;
    this.calcNhaCungCap(this.soLuongNCCToiThieuOriginFormApi);

    // Ngân sách valid
    if (this.isBuggeValid && this.soLuongNCCToiThieu <= 0) {
      // Scroll xuống table
      scrollEl(scollEl, 500);

      // Delay để spin quay 500 ms giây
      setTimeout(() => {
        // Convert nhà cung cấp đề suất thành dạng nha cung cap abc, nha cung cap def ...
        const nha_ccdx = this.f2?.nhaCungCapDeXuatKeys?.value?.map(key => {
          return (this.f2?.isChiDinhNCC?.value ? this.nhaCungCapDeSuatCDOptions : this.nhaCungCapDeSuatOptions)?.find(f => f?.value === key)?.label;
        });
        const nha_ccdx_total = nha_ccdx?.length;
        const nha_ccdx_name = nha_ccdx?.join(', ');
        // Update dữ liệu vào table
        if (this.hangHoaDVSelected) {
          this.hangHoaDVData[this.hangHoaDVSelected.index] = {
            hangHoaId: this.hangHoaDVData[this.hangHoaDVSelected.index].hangHoaId,
            ...this.formGroup2.value,
            nha_ccdx_name: nha_ccdx_name,
            nha_ccdx_total: nha_ccdx_total,
            nha_ccdx_keys: this.f2?.nhaCungCapDeXuatKeys?.value
          };
        } else {
          // Create một row mới vào table
          this.hangHoaDVData.push({
            ...this.formGroup2.value,
            nha_ccdx_name: nha_ccdx_name,
            nha_ccdx_total: nha_ccdx_total,
            nha_ccdx_keys: this.f2?.nhaCungCapDeXuatKeys?.value
          });
        }
        // Reset form
        this.initForm2();
        this.cdf.detectChanges();
      }, 500);
    }
    if (!this.isBuggeValid) {
      swal({
        icon: 'warning',
        title: this.translate.instant('PURCHASE.CREATE.step_2.form.total_estimate.required'),
        buttons: {
          ok: this.translate.instant('COMMON.btn.close'),
        },
      } as any);
    }
    if (this.soLuongNCCToiThieu > 0) {
      const title = await this.translate.get('PURCHASE.CREATE.step_2.form.recommended_supplier.requiredQuantity', { value: this.soLuongNCCToiThieuOriginFormApi }).toPromise();
      swal({
        icon: 'warning',
        title: title,
        buttons: {
          ok: this.translate.instant('COMMON.btn.close'),
        },
      } as any);
    }
    this.isSpinning = false;
  }

  get totalHangHoaDVDisplay() { return this.hangHoaDVData?.reduce(function (total, currentValue) { return Number(total) + Number(currentValue?.giaThamKhao) }, 0); }

  public onRemoveHangHoaDV(index) {
    this.hangHoaDVData = this.hangHoaDVData.filter((f, i) => i != index);
  }

  public onAddBoPhanChuyenMonLQ(key) {
    if (key) {
      const data = this.boPhanLienQuanOptions.find(f => key == f?.value)
      this.boPhanChuyenMonLQData.push(data)
    }
  }

  public onRemoveBoPhanChuyenMonLQ(index) {
    this.boPhanChuyenMonLQData = this.boPhanChuyenMonLQData.filter((f, i) => i != index)
  }

  /**
   * Check chỉ định nhà cung cấp
   */
  public calcNhaCungCap(soLuongNCCToiThieuApi) {
    // Init data
    let totalTable = 0;
    this.hangHoaDVData.forEach(f => {
      if (isNumber(f.nha_ccdx_total)) {
        totalTable += f.nha_ccdx_total
      }
    });
    const totalDropbox = this.f2?.nhaCungCapDeXuatKeys?.value?.length;

    // Calc
    if (isNumber(totalTable) && isNumber(totalDropbox)) {
      this.soLuongNCCToiThieu = soLuongNCCToiThieuApi - totalTable - totalDropbox;
    }

    // Dropbox empty
    if (isNumber(totalTable) && !isNumber(totalDropbox)) {
      this.soLuongNCCToiThieu = soLuongNCCToiThieuApi - totalTable;
    }

    // Table empty
    if (!isNumber(totalTable) && isNumber(totalDropbox)) {
      this.soLuongNCCToiThieu = soLuongNCCToiThieuApi - totalDropbox;
    }

    // Table empty + Dropbox empty
    if (!isNumber(totalTable) && !isNumber(totalDropbox)) {
      this.soLuongNCCToiThieu = soLuongNCCToiThieuApi;
    }
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

  public nextStep(index) {
    if (index == 2 && this.formGroup1.invalid) {
      this.formGroup1.markAllAsTouched();
      return // reject
    }
    if (index == 3 && this.hangHoaDVData.length === 0 || this.formGroup1.invalid) {
      this.formGroup2.markAllAsTouched();
      return // reject
    } else if (this.hangHoaDVData.length > 0) {
      this.formGroup2.markAllAsTouched();
    }
    if (index == 4 && this.hangHoaDVData.length === 0 || this.formGroup1.invalid) {
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

  public getTenHHDV(item) {
    const f = this.hangHoaDVOptions?.find(f => f?.value == item?.hangHoaKey);
    return f ? f?.label : '';
  }

  public getTenLHS(item) {
    const f = this.LoaiTaiLieuOptions?.find(f => f?.value == item?.loai_ho_so);
    return f ? f?.label : '';
  }

  /**
   * Step 1
   */
  public getToTringNoiBoOptions() {
    const query = {
      SortField: 'NgayTao',
      SortOrder: 'desc'
    }
    this.api.get('/api/totrinh-duyetchi-list/noi-bo', query)
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.hoSoId?.toString(), label: m.tenToTrinh })))))
      .subscribe((res: any) => {
        if (res) {
          this.toTrinhNoiBoOptions = res;
        }
      })
  }

  /**
   * Step 1
   */
  public getLoaiNghiepVuOptions() {
    this.api.get('/api/purchase-danh-muc/loai-nghiep-vu')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.loaiNghiepVuKey, label: m.loaiNghiepVuDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.loaiNghiepVuOptions = res;
        }
      })
  }

  /**
   * Step 1
   */
  public getLoaiTaiLieu() {
    this.api.get('/api/purchase-danh-muc/tai-lieu-dinh-kem')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.taiLieuDinhKemKey, label: m.taiLieuDinhKemDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.LoaiTaiLieuOptions = res;
        }
      })
  }

  /**
   * Step 2
   */
  public getHangHoaDichVuOptions() {
    this.api.get('/api/purchase-danh-muc/hang-hoa')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.hangHoaKey, label: m.hangHoaDisplay, dvt: m?.dvt, giaThamKhao: m?.giaThamKhao })))))
      .subscribe((res: any) => {
        if (res) {
          this.hangHoaDVOptions = res;
        }
      })
  }

  /**
   * Step 2
   */
  public getMaNganSachOptions() {
    this.api.get('/api/purchase-danh-muc/ngan-sach')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.nganSachKey, label: m.nganSachDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.maNganSachOptions = res;
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
   * Step 2
   */
  public async getNhaCungCapDeSuatOptions() {
    const res = await this.api.get('/api/purchase-danh-muc/nha-cung-cap').pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.nhaCungCapKey, label: m.nhaCungCapDisplay }))))).toPromise();
    if (res) {
      this.nhaCungCapDeSuatOptions = res;
      this.nhaCungCapDeSuatCDOptions = this.nhaCungCapDeSuatOptions.map(m => ({
        ...m,
        label: `Chỉ định ${m.label}`
      }));
    }
  }

  /**
   * Step 3
   */
  public getBoPhanLienQuanOptions() {
    this.api.get('/api/purchase-danh-muc/bo-phan-lien-quan')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.boPhanLienQuanKey, label: m.boPhanLienQuanDisplay, hoTen: m.hoTen })))))
      .subscribe((res: any) => {
        if (res) {
          this.boPhanLienQuanOptions = res;
        }
      })
  }

  /**
   * Check vượt ngân sách
   */
  public checkNganSach() {
    const bodyParams = {
      YearPay: new Date().getFullYear(),
      MonthPay: new Date().getMonth() + 1,
      NganSachKey: this.f2.nganSachKey.value,
      TongTien: this.f2.giaThamKhao.value, // soLuong * giaDuToan
    }
    return this.api.get('/api/purchase-misc/check-budget', bodyParams).toPromise();
  }

  /**
   * Check chỉ định nhà cung cấp
   */
  public checkNhaCungCap() {
    const bodyParams = {
      TongTien: this.f2.giaThamKhao.value, // soLuong * giaDuToan
    }
    return this.api.get('/api/purchase-misc/check-supplier', bodyParams).toPromise();
  }

  public getObjByDataOptions(dataName: string, key: string) {
    return this[dataName]?.find(f => f?.value === key);
  }

  /**
   * Show full table
   * @param hangHoaDVData 
   */
  public showHangHoaDVFullTable(hangHoaDVData) {
    let data: ThongTinHangHoaDichVus[] = hangHoaDVData?.map(m => ({
      tenHangHoaDichVu: this.getTenHHDV(m),
      quyCach: m?.quyCach,
      dvt: m?.dvt,
      soLuong: m?.soLuong,
      giaDuToan: m?.giaDuToan,
      giaThamKhao: m?.giaThamKhao, // soLuong * giaDuToan
      maNganSach: m?.nganSachKey,
      isBoPhanTuMua: m?.isBoPhanTuMua,
      ngayMongMuon:Math.floor(new Date(m?.ngayMongMuon).getTime() / 1000),
      nccDaGiaoDich: [],
      nccDeXuat: m?.nha_ccdx_name?.split(','),
      ghiChu: m?.ghiChu
    }))

    const detail = {
      thongTinHangHoaDichVus: data,
      tongDuToan: data?.reduce(function (total, current) { return Number(total) + Number(current?.giaThamKhao) }, 0) ?? 0
    }
    this.tableFullModal.showModal(detail);
  }

  public saveDraft() {
    // Save draft
    this.isVisible = false;
    const data = {
      formGroup1: {
        form: this.formGroup1.value,
        files: [] // Không lưu file vì base64 nặng. localStorage chỉ chứa được 5M
      },
      formGroup2: {
        form: this.formGroup2.value,
        table: this.hangHoaDVData,
        total: this.totalHangHoaDVDisplay
      },
      boPhanChuyenMon: this.boPhanChuyenMonLQData,
      isFormHangHoaDV: this.isFormHangHoaDV,
    }
    if (!this.dataRow) {
      // Create mode
      localStorage.setItem('PURCHASE_DRAFT', JSON.stringify(data));
    }
  }

  public async loadDraft() {
    // Edit mode
    if (this.dataRow) {
      const queryPrams = {
        maYCMH: this.dataRow?.maThamChieu,
        idYCMH: this.dataRow?.id,
      }
      this.api.get('/api/purchase-product-detail', queryPrams).subscribe(dataDetail => {
        this.formGroup1.patchValue({
          toTrinhNoiBoKey: dataDetail?.toTrinhNoiBoKey ?? null,
          ghiChu: dataDetail?.ghiChu,
          loaiNghiepVuKey: dataDetail?.loaiNghiepVuKey ?? null,
          mucDich: dataDetail?.mucDich,
          kieuMuaSamKey: dataDetail?.kieuMuaSamKey ?? null,
        })

        this.selectedFilesDetail = dataDetail?.taiLieuDinhKems?.map(m1 => ({
          fileDinhKems: m1?.fileDinhKems?.map(m2 => ({
            attachKey: m1?.loaiHoSo ?? '',
            name: m2?.tenFile ?? '',
            url: m2.url ?? '',
            id: m2?.id ?? '',
          
          }))
        })).map(m => m?.fileDinhKems)?.flat();

        this.hangHoaDVData = dataDetail?.thongTinHangHoaDichVus.map(item => {
          const nccDeXuatKey = item?.nccDeXua && item?.nccDeXua.map(m => {
            const nccdx = this.nhaCungCapDeSuatOptions.find(f => f.label?.toLocaleLowerCase() === m?.toLocaleLowerCase());
            return nccdx ? nccdx?.value : m;
          })
          return {
            hangHoaId: item?.hangHoaId,
            hangHoaKey: item?.hangHoaKey ?? null,
            dvt: item?.dvt,
            soLuong: item?.soLuong,
            giaDuToan: item?.duToanDonGia,
            giaThamKhao: item?.duToanThanhTien, // soLuong * giaDuToan
            ngayMongMuon: item?.ngayMongMuon * 1000,
            nganSachKey: item?.maNganSach ?? null,
            isChiDinhNCC: item?.isChiDinhNCC,
            ghiChu: item?.ghiChu,
            ghiChuEng: item?.ghiChuEng,
            quyCach: item?.quyCach,
            quyCachEng: item?.quyCachEng,
            isBoPhanTuMua: item?.isBoPhanTuMua,
            nhaCungCapDeXuatKeys: nccDeXuatKey ?? null, // Lau sau
          }
        });
        this.boPhanChuyenMonLQData = dataDetail?.boPhanLienQuans?.map(m => ({ value: m?.boPhanLienQuanKey, label: m?.tenBoPhan, hoTen: m?.tenNhanVien }));
      });
    } else {
      // Create mode
      const dataObjStr = localStorage.getItem('PURCHASE_DRAFT');
      if (dataObjStr) {
        const data = JSON.parse(dataObjStr);
        this.formGroup1.patchValue(data?.formGroup1?.form)
        this.formGroup2.patchValue(data?.formGroup2?.form);
        this.hangHoaDVData = data?.formGroup2?.table;
        this.boPhanChuyenMonLQData = data?.boPhanChuyenMon;
      }
    }
  }

  private reqSuccess() {
    this.isVisible = false;
    this.loadList.emit();
    this.removeDraft();
  }

  public removeDraft() {
    localStorage.removeItem('PURCHASE_DRAFT');
  }
}

