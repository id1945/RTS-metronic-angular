import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import { configTextEditor, formatterInputNumber, nullOrNumberOnly, parserInputNumber } from 'src/app/_metronic/shared/shared/common/helper';
import { Options } from 'src/app/_metronic/shared/shared/models/options';
import swal from 'sweetalert';

@Component({
  selector: 'app-form-kpi-modal',
  templateUrl: './form-kpi-modal.component.html',
  styleUrls: ['./form-kpi-modal.component.scss'],
  exportAs: 'form-kpi',
})
export class FormKpiModalComponent implements OnInit {

  @Output() loadList = new EventEmitter;
  @Input() kpiMucTieuNamBoPhanId: string;

  public isVisible: boolean;
  public formGroup: FormGroup;
  public config = configTextEditor;
  public kpiMucTieuId: number;

  // format input number
  public formatter = formatterInputNumber;
  public parser = parserInputNumber;

  public thanhPhanTags: Options[] = [];
  public thuVienOptions: Options[] = [];
  public mucTienBoPhanOptions: Options[] = [];
  public keHoachCongViecLienQuanOptions: Options[] = [];
  public nhanSuChiuTrachNhiemOptions: Options[] = [];
  public donViTinhOptions: Options[] = [];
  public loaiKPIOptions: Options[] = [];
  public tanSuatTheoDoiOptions: Options[] = [];
  public trongSoMax: number;

  constructor(
    private api: ApiService,
    private translate: TranslateService,
  ) {
  }

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      kpiThuVienKey: new FormControl(''),
      mucTieuBoPhanKey: new FormControl(null, Validators.required),
      keHoachCongViecLienQuanKeys: new FormControl(null, Validators.required),
      tenKPI: new FormControl(null, Validators.required),
      noiDungCongThuc: new FormControl(null, Validators.required),
      nhanSuChiuTrachNhiemKeys: new FormControl(null, Validators.required),
      donViTinhKey: new FormControl(null, Validators.required),
      loaiKPIKey: new FormControl(null, Validators.required),
      tanSuatTheoDoiKey: new FormControl(null, Validators.required),
      trongSo: new FormControl(0, Validators.required),
      ghiChu: new FormControl(''),
      tienDoCaNam: new FormControl(0),
      quy1: new FormControl(0),
      quy2: new FormControl(0),
      quy3: new FormControl(0),
      quy4: new FormControl(0),
    });
    // Onchange
    this.f.kpiThuVienKey.valueChanges.subscribe(res => {
      if (res) {
        this.getKpiThuVienOptions(res);
      }
    })
  }

  get f() { return this.formGroup.controls; }

  public async showModal(id?: number) {
    this.kpiMucTieuId = id;
    this.isVisible = true;
    this.ngOnInit();
    // Load options
    this.getThuVienOptions('');
    this.getMucTieuBoPhanOptions('');
    this.getKeHoachCongViecLienQuanOptions('');
    this.getNhanSuChiuTrachNhiemOptions('');
    this.getDonViTinhOptions('');
    this.getLoaiKPIOptions('');
    this.getTanSuatTheoDoiOptions('');
    this.getTrongSoMaxForCreate();
    // Edit
    if (id) {
      this.bindingEditForm(id);
    }
  }

  public getThuVienOptions(SearchText) {
    this.api.get('/api/kpimuctieu-nam-bophan-dm/kpi-thu-vien', { SearchText: SearchText })
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.kpiThuVienKey, label: m.kpiThuVienDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.thuVienOptions = res;
        }
      });
  }

  public getMucTieuBoPhanOptions(SearchText) {
    this.api.get('/api/kpimuctieu-nam-bophan-dm/muc-tieu-bo-phan', { SearchText: SearchText, KPIMucTieuNamBoPhanId: this.kpiMucTieuNamBoPhanId })
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.mucTieuBoPhanKey, label: m.mucTieuBoPhanDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.mucTienBoPhanOptions = res;
        }
      });
  }

  public getKeHoachCongViecLienQuanOptions(SearchText) {
    this.api.get('/api/kpimuctieu-nam-bophan-dm/ke-hoach-cong-viec-lien-quan', { SearchText: SearchText, KPIMucTieuNamBoPhanId: this.kpiMucTieuNamBoPhanId })
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.keHoachCongViecLienQuanKey, label: m.keHoachCongViecLienQuanDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.keHoachCongViecLienQuanOptions = res;
        }
      });
  }

  public getNhanSuChiuTrachNhiemOptions(SearchText) {
    this.api.get('/api/kpimuctieu-nam-bophan-dm/nhan-su-chiu-trach-nhiem', { SearchText: SearchText })
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.nhanSuChiuTrachNhiemKey, label: m.nhanSuChiuTrachNhiemDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.nhanSuChiuTrachNhiemOptions = res;
        }
      });
  }

  public getDonViTinhOptions(SearchText) {
    this.api.get('/api/kpimuctieu-nam-bophan-dm/don-vi-tinh', { SearchText: SearchText })
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.donViTinhKey, label: m.donViTinhDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.donViTinhOptions = res;
        }
      });
  }

  public getLoaiKPIOptions(SearchText) {
    this.api.get('/api/kpimuctieu-nam-bophan-dm/loai-kpi', { SearchText: SearchText, KPIMucTieuNamBoPhanId: this.kpiMucTieuNamBoPhanId })
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.loaiKPIKey, label: m.loaiKPIDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.loaiKPIOptions = res;
        }
      });
  }

  public getTanSuatTheoDoiOptions(SearchText) {
    this.api.get('/api/kpimuctieu-nam-bophan-dm/tan-suat-theo-doi', { SearchText: SearchText })
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.tanSuatTheoDoiKey, label: m.tanSuatTheoDoiDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.tanSuatTheoDoiOptions = res;
        }
      });
  }

  /**
   * TrongSoMax
   * Dành cho mode create
   * @param KPIMucTieuNamBoPhanId 
   */
  public getTrongSoMaxForCreate() {
    this.api.get('/api/kpimuctieu-nam-bophan-create/kpi', { KPIMucTieuNamBoPhanId: this.kpiMucTieuNamBoPhanId }).subscribe((res: any) => {
      if (res) {
        this.trongSoMax = res?.trongSoMax ?? 0;
        this.f.trongSo.setValidators(Validators.max(this.trongSoMax));
        this.formGroup.updateValueAndValidity();
      }
    });
  }

  /**
   * Binding form
   * @param key 
   */
  public getKpiThuVienOptions(key) {
    this.api.get('/api/kpimuctieu-nam-bophan-update/kpi-thu-vien', { kpiThuVienKey: key }).subscribe((res: any) => {
      if (res) {
        this.thanhPhanTags = res?.thanhPhans?.map(m => ({ value: m?.thanhPhanKey, label: m?.thanhPhanDisplay })) as Options[];
        this.formGroup.patchValue({
          mucTieuBoPhanKey: this.mucTienBoPhanOptions.find(f => f.value === res?.mucTieuBoPhanKey) ? res?.mucTieuBoPhanKey : null,// Check exist
          keHoachCongViecLienQuanKeys: this.keHoachCongViecLienQuanOptions.find(f => f.value === res?.keHoachCongViecLienQuanKeys) ? res?.keHoachCongViecLienQuanKeys : null,// Check exist
          tenKPI: res?.tenKPI ?? '',
          noiDungCongThuc: res?.noiDungCongThuc ?? '',
          donViTinhKey: this.donViTinhOptions.find(f => f.value === res?.donViTinhKey) ? res?.donViTinhKey : null,// Check exist
          loaiKPIKey: this.loaiKPIOptions.find(f => f.value === res?.loaiKPIKey) ? res?.loaiKPIKey : null,// Check exist
          tanSuatTheoDoiKey: this.tanSuatTheoDoiOptions.find(f => f.value === res?.tanSuatTheoDoiKey) ? res?.tanSuatTheoDoiKey : null,// Check exist
          ghiChu: res?.ghiChu ?? ''
        });
        // Message!
        swal({
          icon: 'success',
          title: 'Tự động điền nhanh KPI thành công',
          timer: 1500,
          buttons: {
            visible: false
          },
          className: 'pb-10'
        })
      }
    });
  }

  public onAddThanhPhan(item) {
    this.thanhPhanTags.push(item);
  }

  /**
   * Submit+
   * Create
   */
  public onCreate() {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      const params = {
        thanhPhanKeys: this.thanhPhanTags.map(m => m.value),
        ...this.formGroup.value,
        quy1: nullOrNumberOnly(this.f.quy1.value),
        quy2: nullOrNumberOnly(this.f.quy2.value),
        quy3: nullOrNumberOnly(this.f.quy3.value),
        quy4: nullOrNumberOnly(this.f.quy4.value),
        tienDoCaNam: nullOrNumberOnly(this.f.tienDoCaNam.value),
      }
      // Call api
      this.api.post(`/api/kpimuctieu-nam-bophan-create/kpi`, params).subscribe(
        res => {
          if (res?.isSuccess) {
            swal({
              icon: "success",
              title: 'Thêm mới KPI năm bộ phận thành công!',
              buttons: {
                ok: this.translate.instant('COMMON.btn.close'),
              },
            } as any).then(() => {
              this.isVisible = false;
              this.loadList.emit();
            });
          } else {
            this.api.errorMessage('Thêm mới KPI năm bộ phận không thành công!');
          }
        }, err => this.api.errorMessage(err));
    }
  }

  /**
   * Submit=
   * Create
   */
  public onEdit() {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid && this.kpiMucTieuId) {
      const params = {
        kpiMucTieuId: this.kpiMucTieuId,
        thanhPhanKeys: this.thanhPhanTags.map(m => m.value),
        ...this.formGroup.value,
        quy1: nullOrNumberOnly(this.f.quy1.value),
        quy2: nullOrNumberOnly(this.f.quy2.value),
        quy3: nullOrNumberOnly(this.f.quy3.value),
        quy4: nullOrNumberOnly(this.f.quy4.value),
        tienDoCaNam: nullOrNumberOnly(this.f.tienDoCaNam.value),
      }
      // Call api
      this.api.post(`/api/kpimuctieu-nam-bophan-update/kpi`, params).subscribe(
        res => {
          if (res?.isSuccess) {
            swal({
              icon: "success",
              title: 'Cập nhật KPI năm bộ phận thành công!',
              buttons: {
                ok: this.translate.instant('COMMON.btn.close'),
              },
            } as any).then(() => {
              this.isVisible = false;
              this.loadList.emit();
            });
          } else {
            this.api.errorMessage('Cập nhật KPI năm bộ phận không thành công!');
          }
        }, err => this.api.errorMessage(err));
    }
  }

  public async bindingEditForm(id) {
    const data = await this.api.get('/api/kpimuctieu-nam-bophan-update/kpi', { KPIMucTieuId: id }).toPromise();
    if (data) {
      const clone = { ...data };
      delete clone?.kpiMucTieuId;
      delete clone?.thanhPhanKeys;
      // binding to form
      this.formGroup.patchValue(clone);
      this.thanhPhanTags = data?.thanhPhans?.map(m => ({ value: m?.thanhPhanKey, label: m?.thanhPhanDisplay })) as Options[];
    }
  }

}
