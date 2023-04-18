import { AuthService } from 'src/app/modules/auth';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import swal from 'sweetalert';
import { TranslateService } from '@ngx-translate/core';
import { Options } from 'src/app/_metronic/shared/shared/models/options';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import { formatterInputNumber, parserInputNumber, removeEmpty, scrollEl } from 'src/app/_metronic/shared/shared/common/helper';

@Component({
  selector: 'app-mission-form-modal',
  templateUrl: './mission-form-modal.component.html',
  styleUrls: ['./mission-form-modal.component.scss']
})
export class MissionFormModalComponent implements OnInit {
  @Output() loadList = new EventEmitter;

  // format input number
  public formatter = formatterInputNumber;
  public parser = parserInputNumber;

  public isVisible = false;
  public step: number;
  public today = new Date();
  public scrollEl = scrollEl;

  // Step 1
  public formGroup1: FormGroup;
  public keHoachCongTacOptions: Options[] = [];
  public noiDungCongTacOptions: Options[] = [];
  public nghiepVuOptions: Options[] = [];

  // Step 2
  public formGroup2: FormGroup;
  public tinhThanhOptions: Options[] = [];
  // public quanHuyenOptions: Options[] = [];
  public quocGiaOptions: Options[] = [];
  public diaChiTrongNuoc: Options[] = [];

  // Step 3
  public formGroup3: FormGroup;
  public isForm3 = false;
  public nguoiDiOptions: Options[] = [];
  public dsNguoiDiDataTable: any[] = [];
  public chiPhiTamUngDataTable: any[] = [];
  public chiPhiCongTacKey = ['phiAnSang', 'phiAnTrua', 'phiAnToi', 'phiSinhHoat', 'phiVanChuyen'];

    // Edit mode
    public dataRow: any;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    public auth: AuthService,
    private translate: TranslateService,
  ) {
  }

  ngOnInit() {
    // Form step 1
    this.initForm1();
    // Form step 2
    this.initForm2();
    // Form step 3
    this.initForm3();
  }

  /**
   * SHOW MODAL
   * @param data 
   */
  public async showModal(data = null) {
    this.step = 1;
    this.dataRow = data;
    this.isVisible = true;
    this.ngOnInit();
   
    // Step 1
    this.getDieuDongCongTac();

    this.getKeHoachCongTac();
    this.getNghiepVu();
    // Step 2
    this.getTinhThanhOptions();
    this.getQuocGiaOptions();
    // Step 3
    this.getNguoiDiOptions();

     // Binding
     this.loadDraft();
  }

  /**
   * Step 1
   * Init or reset FormGroup
   */
  private initForm1() {
    this.formGroup1 = this.fb.group({
      isTrongKeHoach: [true],
      maDieuDongCongTac: [''],
      nguoiDangKy: [''],
      // Trong kế hoạch công tác 
      keHoachCongTacKey: ['', Validators.required],
      noiDungCongTacKey: ['', Validators.required],
      // Ngoài kế hoạch công tác
      nghiepVuKey: [''],
    });
    // Onchange
    this.f1.keHoachCongTacKey.valueChanges.subscribe((key: string) => {
      if (key) {
        this.getNoiDungCongTac(key);
      }
    });
    // Onchange update required
    this.f1.isTrongKeHoach.valueChanges.subscribe((key: boolean) => {
      if (key) {
        // Trong kế hoạch công tác 
        this.f1.keHoachCongTacKey.setValidators(Validators.required);
        this.f1.noiDungCongTacKey.setValidators(Validators.required);
      } else {
        // Ngoài kế hoạch công tác
        this.f1.keHoachCongTacKey.clearValidators();
        this.f1.noiDungCongTacKey.clearValidators();
        // Set DateTime for Step 2
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        this.formGroup2.patchValue({
          ngayDi: today,
          ngayVe: today,
        });
        this.formGroup3.patchValue({
          ngayDi: today,
          ngayVe: today,
        });
      }
      this.f1.keHoachCongTacKey.updateValueAndValidity();
      this.f1.noiDungCongTacKey.updateValueAndValidity();
    });
    // Onchange nội dung công tác binding data step2
    this.f1?.noiDungCongTacKey?.valueChanges.subscribe((key: string) => {
      if (key && this.f1.isTrongKeHoach?.value) {
        const noiDung = this.getObjOptions('noiDungCongTacOptions', key)?.meta;
        this.formGroup2.patchValue({
          tinhThanhKey: noiDung?.tinhThanhKey,
          // quanHuyenKey: noiDung?.quanHuyenKey,
          quocGiaKey: noiDung?.quocGiaKey,
          ngayDi: noiDung?.ngayDi * 1000,
          ngayVe: noiDung?.ngayVe * 1000,
          noiDung: noiDung?.noiDungCongTacDisplay,
        });
        this.formGroup3.patchValue({
          ngayDi: noiDung?.ngayDi * 1000,
          ngayVe: noiDung?.ngayVe * 1000,
        });
      }
    });
  }

  get f1() { return this.formGroup1.controls; }

  /**
   * Step 2
   * Ngoài kế hoạch công tác
   */
  private initForm2() {
    this.dsNguoiDiDataTable = [];
    this.chiPhiTamUngDataTable = [];
    // FormGroup
    this.formGroup2 = this.fb.group({
      isTrongNuoc: [true],
      // Nước ngoài
      quocGiaKey: [''],
      quocGiaChiTiet: [''],
      // Trong nước
      tinhThanhKey: ['', Validators.required],
      // quanHuyenKey: ['', Validators.required],
      ngayDi: [null, [Validators.required]],
      ngayVe: [null, [Validators.required]],
      noiDung: ['', Validators.required],
    });
    // Onchange
    this.f2?.tinhThanhKey?.valueChanges.subscribe((key: string) => {
      if (key) {
        // this.f2.quanHuyenKey.setValue(null);
       // this.getQuanHuyenOptions(key);
      }
    });
    // Onchange Địa điểm công tác update required
    this.f2?.isTrongNuoc.valueChanges.subscribe((key: boolean) => {
      if (key) {
        // Trong nước
        this.f2.tinhThanhKey.setValidators(Validators.required);
        // this.f2.quanHuyenKey.setValidators(Validators.required);
        this.f2.quocGiaKey.clearValidators();
      } else {
        // Nước ngoài
        this.f2.tinhThanhKey.clearValidators();
        // this.f2.quanHuyenKey.clearValidators();
        this.f2.quocGiaKey.setValidators(Validators.required);
      }
      this.f2.tinhThanhKey.updateValueAndValidity();
      // this.f2.quanHuyenKey.updateValueAndValidity();
      this.f2.quocGiaKey.updateValueAndValidity();
    });
  }

  get f2() { return this.formGroup2?.controls; };

  private dateRangeValidator2: ValidatorFn = (): { [key: string]: any; } | null => {
    let invalid = false;
    const from = this.f2?.ngayDi?.value;
    const to = this.f2?.ngayVe?.value;
    if (from && to) {
      invalid = new Date(from).valueOf() > new Date(to).valueOf();
    }
    return invalid ? { invalidRange: { from, to } } : null;
  };

  /**
   * Step 2
   * Ngoài kế hoạch công tác
   */
  private initForm3() {
    // FormGroup
    this.formGroup3 = this.fb.group({
      nguoiDiKey: ['', Validators.required],
      ngayDi: [null, [Validators.required, this.dateRangeValidator3]],
      ngayVe: [null, [Validators.required, this.dateRangeValidator3]],
      isDatMayBay: [true],
      isDatKhachSan: [true],
      isGuiXeTaiCongTy: [true],
      ghiChu: [''],
      lyDoDoiNgay: [''],
    });
  }

  get f3() { return this.formGroup3?.controls; };

  private dateRangeValidator3: ValidatorFn = (): { [key: string]: any; } | null => {
    let invalid = false;
    const from = this.f3?.ngayDi?.value;
    const to = this.f3?.ngayVe?.value;
    if (from && to) {
      invalid = new Date(from).valueOf() > new Date(to).valueOf();
    }
    return invalid ? { invalidRange: { from, to } } : null;
  };

  public trackByFn(index: number, item: any) {
    return index;
  }

  /**
   * Submit form 3
   */
  public onSubmitForm3(scollEl: HTMLElement) {
    // Validate form
    if (this.formGroup3.invalid) {
      this.formGroup3.markAllAsTouched();
      return
    }

    this.dsNguoiDiDataTable.push(this.formGroup3.value);

    // Request
    this.addChiPhiTamUng();

    // Scroll xuống table
    this.scrollEl(scollEl, 500);

    // Close form2 && clear
    this.formGroup3.patchValue({
      nguoiDiKey: [''],
      isDatMayBay: true,
      isDatKhachSan: true,
      isGuiXeTaiCongTy: true,
      ghiChu: '',
      lyDoDoiNgay: '',
    });
    const noiDung = this.getObjOptions('noiDungCongTacOptions', this.f1?.noiDungCongTacKey.value)?.meta;
    this.formGroup3.patchValue({
      ngayDi: noiDung?.ngayDi * 1000,
      ngayVe: noiDung?.ngayVe * 1000,
    });
    this.isForm3 = false;
  }

  public onDeleteItemTableForm3(nguoiDiKey: string) {
    this.dsNguoiDiDataTable = this.dsNguoiDiDataTable.filter((f) => f.nguoiDiKey !== nguoiDiKey);
    this.chiPhiTamUngDataTable = this.chiPhiTamUngDataTable.filter((f) => f.nguoiDiKey !== nguoiDiKey);
  }

  /**
   * CREATE
   * @returns 
   */
  public onCreate(isApprove: boolean) {
    if (this.formGroup1.invalid || this.formGroup2.invalid || this.dsNguoiDiDataTable?.length === 0) {
      return;
    }

    const params = {
      ...this.formGroup1.value,
      thongTinChiTiet: {
        ...this.formGroup2.value,
        ngayDi: Math.floor(new Date(this.f2?.ngayDi.value).getTime() / 1000),
        ngayVe: Math.floor(new Date(this.f2?.ngayVe.value).getTime() / 1000),
        trongNuoc: {
          items: this.diaChiTrongNuoc?.map(m => ({ tinhThanhKey: m.meta?.tinhThanhKey}))
        },
      },
      nguoiDi: {
        items: this.dsNguoiDiDataTable.map(m => ({
          ...m,
          ngayDi: Math.floor(new Date(m?.ngayDi).getTime() / 1000),
          ngayVe: Math.floor(new Date(m?.ngayVe).getTime() / 1000),
        }))
      },
      tamUng: {
        items: this.chiPhiTamUngDataTable.map(m => {
          delete m?.ghiChu;
          delete m?.hoTen;
          return m;
        })
      }
    };

    delete params?.nguoiDangKy;

    const url = isApprove? "/api/dieudong-congtac-create" : "/api/dieudong-congtac-create/save-to-draft";
    const title = isApprove? "Trình duyệt điều động công tác thành công !" : "Thêm mới điều động công tác thành công!";

    this.api.post(url, params).subscribe(res => {
      if (res?.isSuccess) {
        // Message ok
        swal({
          icon: 'success',
          title: title,
          buttons: {
            ok: this.translate.instant('COMMON.btn.close'),
          },
        } as any).then(() => {
          this.isVisible = false;
          this.loadList.emit();
          this.removeDraft();
        });
      } else {
        this.api.errorMessage('Thêm mới điều động công tác không thành công!');
      }
    }, err => {
      this.api.errorMessage(err);
    });
  }


  public onEdit(isApprove: boolean) {
    if (this.formGroup1.invalid || this.formGroup2.invalid || this.dsNguoiDiDataTable?.length === 0) {
      return;
    }

    const params = {
      hoSoId : this.dataRow?.hoSoId,
      ...this.formGroup1.value,
      thongTinChiTiet: {
        ...this.formGroup2.value,
        ngayDi: Math.floor(new Date(this.f2?.ngayDi.value).getTime() / 1000),
        ngayVe: Math.floor(new Date(this.f2?.ngayVe.value).getTime() / 1000),
        trongNuoc: {
          items: this.diaChiTrongNuoc?.map(m => ({ tinhThanhKey: m.meta?.tinhThanhKey}))
        },
      },
      nguoiDi: {
        items: this.dsNguoiDiDataTable.map(m => ({
          ...m,
          ngayDi: Math.floor(new Date(m?.ngayDi).getTime() / 1000),
          ngayVe: Math.floor(new Date(m?.ngayVe).getTime() / 1000),
        }))
      },
      tamUng: {
        items: this.chiPhiTamUngDataTable.map(m => {
          delete m?.ghiChu;
          delete m?.hoTen;
          return m;
        })
      }
    };

    delete params?.nguoiDangKy;

    const url = isApprove? "/api/dieudong-congtac-create" : "/api/dieudong-congtac-update";
    const title = isApprove? "Trình duyệt điều động công tác thành công !" : "Sửa điều động công tác thành công!";

    this.api.post(url, params).subscribe(res => {
      if (res?.isSuccess) {
        // Message ok
        swal({
          icon: 'success',
          title: title,
          buttons: {
            ok: this.translate.instant('COMMON.btn.close'),
          },
        } as any).then(() => {
          this.isVisible = false;
          this.loadList.emit();
          this.removeDraft();
        });
      } else {
        this.api.errorMessage('Thêm mới điều động công tác không thành công!');
      }
    }, err => {
      this.api.errorMessage(err);
    });
  }


  public prevStep() {
    this.step -= 1;
  }

  public getKeHoachCongTac() {
    this.api.get('/api/dieudong-congtac-dm/ke-hoach-cong-tac')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m?.keHoachCongTacKey, label: m?.keHoachCongTacDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.keHoachCongTacOptions = res;
        }
      });
  }

  public getDieuDongCongTac() {
    this.api.get('/api/dieudong-congtac-create')
      .subscribe((res: any) => {
        if (res) {
          this.f1.maDieuDongCongTac.setValue(res?.maDieuDongCongTac);
          this.f1.nguoiDangKy.setValue(res?.hoTenNguoiDangKy);
        }
      });
  }

  public getNoiDungCongTac(key: string) {
    this.api.get('/api/dieudong-congtac-dm/noi-dung-cong-tac', { KeHoachCongTacKey: key })
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m?.noiDungCongTacKey, label: m?.noiDungCongTacDisplay, meta: m })))))
      .subscribe((res: any) => {
        if (res) {
          this.noiDungCongTacOptions = res;
          this.noiDungCongTacOptions?.length && this.f1?.noiDungCongTacKey.patchValue(this.noiDungCongTacOptions[0].value);
        }
      });
  }

  public getNghiepVu() {
    this.api.get('/api/dieudong-congtac-dm/nghiep-vu')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m?.nghiepVuKey, label: m?.nghiepVuDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.nghiepVuOptions = res;
        }
      });
  }

  public getTinhThanhOptions() {
    this.api.get('/api/dieudong-congtac-dm/tinh-thanh')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.tinhThanhKey, label: m.tinhThanhDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.tinhThanhOptions = res;
        }
      });
  }

  // public getQuanHuyenOptions(TinhThanhKey: string) {
  //   this.api.get('/api/dieudong-congtac-dm/quan-huyen', { TinhThanhKey: TinhThanhKey })
  //     .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.quanHuyenKey, label: m.quanHuyenDisplay })))))
  //     .subscribe((res: any) => {
  //       if (res) {
  //         this.quanHuyenOptions = res;
  //       }
  //     });
  // }

  public getQuocGiaOptions() {
    this.api.get('/api/dieudong-congtac-dm/quoc-gia')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.quocGiaKey, label: m.quocGiaDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.quocGiaOptions = res;
        }
      });
  }

  public getNguoiDiOptions() {
    this.api.get('/api/dieudong-congtac-dm/nguoi-di')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.nguoiDiKey, label: m.nguoiDiDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.nguoiDiOptions = res;
        }
      });
  }

  public thanhTienTamTinh(item) {
    const soTien = this.chiPhiCongTacKey?.map(m => (item[m]?.thanhTien ?? 0));
    return soTien?.reduce((tien, total) => tien ? tien + total : total) ?? 0;
  }

  /**
   * Chi phí đề nghị tạm ứng
   */
  public addChiPhiTamUng() {
    if (this.formGroup3.invalid) {
      this.formGroup3.markAllAsTouched();
      return;
    }
    const params = removeEmpty({
      NguoiDiKey: this.f3.nguoiDiKey.value,
      QuocGiaKey: this.f2.quocGiaKey.value,
      TinhThanhKey: this.f2.tinhThanhKey.value,
      NgayDi: Math.floor(new Date(this.f3.ngayDi.value).getTime() / 1000),
      NgayVe: Math.floor(new Date(this.f3.ngayVe.value).getTime() / 1000),
    });

    if (this.f1?.isTrongKeHoach?.value) {
      // Ngoài kế hoạch công tác
      if (this.f2?.tinhThanhKey?.value) {
        // Trong nước
        delete params.QuocGiaKey;
      } else {
        // Nước ngoài
        delete params.TinhThanhKey
      }
    } else {
      // Ngoài kế hoạch công tác
      if (this.f2?.isTrongNuoc?.value) {
        // Trong nước
        delete params.QuocGiaKey;
      } else {
        // Nước ngoài
        delete params.TinhThanhKey
      }
    }

    // Request
    this.api.get('/api/dieudong-congtac-create/tam-ung', params).subscribe((res: any) => {
      if (res) {
        this.chiPhiTamUngDataTable.push(res);
      }
    }, err => this.api.errorMessage(err));
  }

  public onThemDiaChiTrongNuoc() {
    if (this.f2.tinhThanhKey.valid ) {
      this.diaChiTrongNuoc.push({
        value: null,
        label: null,
        meta: {
          tinhThanhKey: this.f2.tinhThanhKey.value,
          // quanHuyenKey: this.f2.quanHuyenKey.value,
          tinhThanhLabel: this.getObjOptions('tinhThanhOptions', this.f2.tinhThanhKey.value).label,
          // quanHuyenLabel: this.getObjOptions('quanHuyenOptions', this.f2.quanHuyenKey.value).label,
        }
      });
    } else {
      this.api.errorMessage('Chưa chọn Tỉnh thành và Quận huyện!');
    }
  }

  public onXoaDiaChi(index: number) {
    this.diaChiTrongNuoc = this.diaChiTrongNuoc.filter((f, i) => i !== index);
  }

  public getObjOptions(dataName: string, key: string) {
    return this[dataName]?.find(f => f?.value === key);
  }

  public isDetectorChangeDatetime(): boolean {
    const noiDung = this.getObjOptions('noiDungCongTacOptions', this.f1?.noiDungCongTacKey.value)?.meta;
    return new Date(this.f3.ngayDi.value).getTime() !== noiDung?.ngayDi * 1000 || new Date(this.f3.ngayVe.value).getTime() !== noiDung?.ngayVe * 1000;
  }

  public nextStep(index) {
    if (index == 2 && this.formGroup1.invalid) {
      this.formGroup1.markAllAsTouched();
      return // reject
    }
    if (index == 3 && this.formGroup2.invalid) {
      this.formGroup2.markAllAsTouched();
      return // reject
    }
    if (index == 4 && this.dsNguoiDiDataTable?.length === 0) {
      return // reject
    }
    if (index) {
      this.step = index; // Next
    } else {
      this.step += 1; // Next ++
    }
  }

  public saveDraft() {
    // Save draft
    this.isVisible = false;
    const data = {
      formGroup1: this.formGroup1.value,
      formGroup2: this.formGroup2.value,
      dsNguoiDiDataTable: this.dsNguoiDiDataTable,
      chiPhiTamUngDataTable: this.chiPhiTamUngDataTable,
    }
    // Create mode
    localStorage.setItem('MISSION_DRAFT', JSON.stringify(data));
  }


  public async loadDraft() {
    // Edit mode
    if (this.dataRow) {
      const queryPrams = {
        HoSoId: this.dataRow?.hoSoId,
      }
      await this.api.get('/api/dieudong-congtac-update', queryPrams).toPromise().then(res => {
        this.formGroup1.patchValue({
          isTrongKeHoach: res?.isTrongKeHoach,
          maDieuDongCongTac: res?.maDieuDongCongTac,
          keHoachCongTacKey :res?.keHoachCongTacKey,
          noiDungCongTacKey :res?.noiDungCongTacKey,
          nghiepVuKey :res?.nghiepVuKey,
          // loaiNghiepVuKey: res?.loaiNghiepVuKey,
          // mucDich: res?.mucDich,
          // kieuMuaSamKey: res?.kieuMuaSamKey,
        });
        this.dsNguoiDiDataTable = res?.nguoiDi?.items.map( item=>{
          let obj = {
            nguoiDiKey : item?.nguoiDiKey,
            isDatMayBay : item?.isDatMayBay,
            isDatKhachSan : item?.isDatKhachSan,
            isGuiXeTaiCongTy : item?.isGuiXeTaiCongTy,
            ghiChu : item?.ghiChu,
            lyDoDoiNgay : item?.lyDoDoiNgay,
            quocGiaChiTiet: item?.quocGiaChiTiet,
            tinhThanhKey : item?.tinhThanhKey,
            ngayDi : item?.ngayDi *1000,
            ngayVe : item?.ngayVe*1000,
            uuid:new Date().getTime().toString() + Math.random().toString(36).substring(2)
          }
          console.log(obj)
          return obj;
        })
        // this.selectedFilesDetail = res?.dinhKem?.map(m1 => ({
        //   items: m1?.items?.map(m2 => ({
        //     tenFile: m2?.tenFile ?? '',
        //     urlDownload: m2.urlDownload ?? ''
          
        //   }))
        // })).map(m => m?.items)?.flat();
      });
    } else {
      // Create mode
      const dataObjStr = localStorage.getItem('MISSION_DRAFT');
      if (dataObjStr) {
        const data = JSON.parse(dataObjStr);
        this.formGroup1.patchValue(data?.formGroup1);
        this.formGroup2.patchValue(data?.formGroup2);
        this.dsNguoiDiDataTable = data?.dsNguoiDiDataTable ?? [];
        this.chiPhiTamUngDataTable = data.chiPhiTamUngDataTable ?? [];
      }
    }
    this.diaChiTrongNuoc = [];
  }

  public removeDraft() {
    this.formGroup1.reset();
    this.formGroup2.reset();
    this.formGroup3.reset();

    localStorage.removeItem('MISSION_DRAFT');
  }
}
