import { TranslateService } from '@ngx-translate/core';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import { configTextEditor, formatterInputNumber, parserInputNumber } from 'src/app/_metronic/shared/shared/common/helper';
import { Options } from 'src/app/_metronic/shared/shared/models/options';
import swal from 'sweetalert';

@Component({
  selector: 'app-library-form-modal',
  templateUrl: './library-form-modal.component.html',
  styleUrls: ['./library-form-modal.component.scss'],
  exportAs: 'library-form'
})
export class LibraryFormModalComponent implements OnInit {
  @Output() loadList = new EventEmitter;

  // format input number
  public formatter = formatterInputNumber;
  public parser = parserInputNumber;

  public isVisible: boolean;
  public formGroup: FormGroup;
  public config = configTextEditor;
  // Options
  public boPhanOptions: Options[] = [];
  public mucTieuNamOptions: Options[] = [];
  public mucTieuBoPhanOptions: Options[] = [];
  public keHoachCongViecOptions: Options[] = [];
  public loaiCongThucOptions: Options[] = [];
  public thanhPhanTags: Options[] = [];
  public donViOptions: Options[] = [];
  public loaiKpiOptions: Options[] = [];
  public tanSuatOptions: Options[] = [];

  public kpiMucTieuId: number;

  constructor(
    private api: ApiService,
    private translate: TranslateService,
  ) { }

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      phongBanKey: new FormControl(null, Validators.required),
      mucTieuNamBoPhanKey: new FormControl(null, Validators.required),
      mucTieuBoPhanKey: new FormControl(null, Validators.required),
      keHoachCongViecLienQuanKeys: new FormControl([]),
      tenKPI: new FormControl('', Validators.required),
      noiDungCongThuc: new FormControl('', Validators.required),
      congThucTinhToan: new FormControl('', Validators.required),
      loaiCongThucKey: new FormControl(null, Validators.required),
      donViTinhKey: new FormControl(null, Validators.required),
      loaiKPIKey: new FormControl(null, Validators.required),
      tanSuatTheoDoiKey: new FormControl(null, Validators.required),
      trongSo: new FormControl(0),
      ghiChu: new FormControl(''),
    });
    // phongBanKey - change
    this.f.phongBanKey.valueChanges.subscribe(res => {
      if (res) {
        this.getMucTieuNamOptions(res);
      }
    });
    // mucTieuNamBoPhanKey - change
    this.f.mucTieuNamBoPhanKey.valueChanges.subscribe(res => {
      if (res) {
        this.getMucTieuBoPhanOptions(res);
        this.getKeHoachCongViecOptions(res);
      }
    });
  }

  get f() { return this.formGroup.controls; }

  public showModal(id?: number) {
    this.kpiMucTieuId = id;
    this.isVisible = true;
    this.thanhPhanTags = [];
    this.ngOnInit();
    // Load options
    this.getBoPhanOptions();
    this.getLoaiCongThucOptions();
    this.getDonViOptions();
    this.getLoaiKpiOptions();
    this.getTanSuatOptions();
    // Edit
    if (id) {
      this.bindingEdit(id);
    }
  }

  public getBoPhanOptions() {
    this.api.get('/api/danhsachthuvienkpibophan-dm/phong-ban')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.phongBanKey, label: m.phongBanDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.boPhanOptions = res;
        }
      })
  }

  public getMucTieuNamOptions(PhongBanKey) {
    this.api.get('/api/danhsachthuvienkpibophan-dm/muc-tieu-nam-bo-phan', { PhongBanKey: PhongBanKey })
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.mucTieuNamBoPhanKey, label: m.mucTieuNamBoPhanDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.mucTieuNamOptions = res;
        }
      })
  }

  public getMucTieuBoPhanOptions(MucTieuNamBoPhanKey) {
    this.api.get('/api/danhsachthuvienkpibophan-dm/muc-tieu-bo-phan', { MucTieuNamBoPhanKey: MucTieuNamBoPhanKey })
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.mucTieuBoPhanKey, label: m.mucTieuBoPhanDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.mucTieuBoPhanOptions = res;
        }
      })
  }

  public getKeHoachCongViecOptions(MucTieuNamBoPhanKey) {
    this.api.get('/api/danhsachthuvienkpibophan-dm/ke-hoach-cong-viec-lien-quan', { MucTieuNamBoPhanKey: MucTieuNamBoPhanKey })
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.keHoachCongViecLienQuanKey, label: m.keHoachCongViecLienQuanDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.keHoachCongViecOptions = res;
        }
      })
  }

  public getLoaiCongThucOptions() {
    this.api.get('/api/danhsachthuvienkpibophan-dm/loai-cong-thuc')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.loaiCongThucKey, label: m.loaiCongThucDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.loaiCongThucOptions = res;
        }
      })
  }

  public getDonViOptions() {
    this.api.get('/api/danhsachthuvienkpibophan-dm/don-vi-tinh')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.donViTinhKey, label: m.donViTinhDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.donViOptions = res;
        }
      })
  }

  public getLoaiKpiOptions() {
    this.api.get('/api/danhsachthuvienkpibophan-dm/loai-kpi')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.loaiKPIKey, label: m.loaiKPIDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.loaiKpiOptions = res;
        }
      })
  }

  public getTanSuatOptions() {
    this.api.get('/api/danhsachthuvienkpibophan-dm/tan-suat-theo-doi')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.tanSuatTheoDoiKey, label: m.tanSuatTheoDoiDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.tanSuatOptions = res;
        }
      })
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
      const bodyParam = {
        ...this.formGroup.value,
        thanhPhanKeys: this.thanhPhanTags.map(m => m.value)
      };
      // POST
      this.api.post(`/api/danhsachthuvienkpibophan-create`, bodyParam).subscribe(res => {
        if (res?.isSuccess) {
          swal({
            icon: "success",
            title: 'Thêm mới thư viện KPI bộ phận thành công!',
            buttons: {
              ok: this.translate.instant('COMMON.btn.close'),
            },
          } as any).then(() => {
            this.isVisible = false;
            this.loadList.emit();
          });
        } else {
          this.api.errorMessage('Thêm mới thư viện KPI bộ phận không thành công!');
        }
      }, err => this.api.errorMessage(err));
    }
  }

  /**
   * Submit=
   * Update 
   */
  public onEdit() {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      const bodyParam = {
        ...this.formGroup.value,
        kpiMucTieuId: this.kpiMucTieuId,
        thanhPhanKeys: this.thanhPhanTags.map(m => m.value)
      };
      // POST
      this.api.post(`/api/danhsachthuvienkpibophan-update`, bodyParam).subscribe(res => {
        if (res?.isSuccess) {
          swal({
            icon: "success",
            title: 'Cập nhật thư viện KPI bộ phận thành công!',
            buttons: {
              ok: this.translate.instant('COMMON.btn.close'),
            },
          } as any).then(() => {
            this.isVisible = false;
            this.loadList.emit();
          });
        } else {
          this.api.errorMessage('Cập nhật thư viện KPI bộ phận không thành công!');
        }
      }, err => this.api.errorMessage(err));
    }
  }

  /**
   * Binding form
   * @param id 
   */
  public bindingEdit(id) {
    this.api.get('/api/danhsachthuvienkpibophan-update', { KPIMucTieuId: id }).subscribe(res => {
      if (res) {
        // binding to form
        this.formGroup.patchValue({
          mucTieuNamBoPhanKey: res?.mucTieuNamBoPhan?.mucTieuNamBoPhanKey,
          mucTieuBoPhanKey: res?.mucTieuBoPhan?.mucTieuBoPhanKey,
          keHoachCongViecLienQuanKeys: res?.keHoachCongViecLienQuans?.map(m => m?.keHoachCongViecLienQuanKey),
          ...res
        });
        this.thanhPhanTags = res?.thanhPhanKeys?.map(m => ({ value: m?.thanhPhanKey, label: m?.thanhPhanDisplay })) as Options[];
      }
    }, err => this.api.errorMessage(err));
  }
}