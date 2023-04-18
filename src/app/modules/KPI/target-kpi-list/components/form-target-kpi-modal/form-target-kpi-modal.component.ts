import { Options } from 'src/app/_metronic/shared/shared/models/options';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import swal from 'sweetalert';
import { formatterInputNumber, parserInputNumber } from 'src/app/_metronic/shared/shared/common/helper';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';

@Component({
  selector: 'app-form-target-kpi-modal',
  templateUrl: './form-target-kpi-modal.component.html',
  styleUrls: ['./form-target-kpi-modal.component.scss'],
  exportAs: 'form-target-kpi'
})
export class FormTargetKPIModalComponent implements OnInit {
  @Output() loadList = new EventEmitter;

  // format input number
  public formatter = formatterInputNumber;
  public parser = parserInputNumber;

  public formGroup: FormGroup;
  public isVisible: boolean;

  // Options
  public thanhPhanTags: Options[] = [];
  public mucTieuOptions: Options[] = [];
  public loaiCongThucOptions: Options[] = [];
  public nhanSuChiuTrachNhiemOptions: Options[] = [];
  public phongBanOptions: Options[] = [];
  public donViTinhOptions: Options[] = [];
  public loaiKPIOptions: Options[] = [];
  public tanSuatKPIOptions: Options[] = [];

  // Edit
  public dataModal: any;

  constructor(
    private api: ApiService,
    private translate: TranslateService,
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  /**
   * Show modal
   */
  async showModal(item = null) {
    this.isVisible = true;
    this.dataModal = item;
    this.thanhPhanTags = [];
    this.initForm();
    // Load options
    this.getMucTieuOptions();
    this.getLoaiCongThucOptions();
    this.getNhanSuChiuTrachNhiemOptions();
    this.getPhongBanOptions();
    this.getDonViTinhOptions();
    this.getLoaiKPIOptions();
    this.getTanSuatKPIOptions();
    // Edit
    if (item) {
      this.bindingEdit();
    }
  }

  /**
   * Validate
   */
  private initForm() {
    this.formGroup = new FormGroup({
      mucTieuKey: new FormControl('', Validators.required),
      tenKPI: new FormControl('', Validators.required),
      noiDungCongThuc: new FormControl(),
      // thanhPhanKeys: new FormControl(),
      congThucTinhToan: new FormControl(),
      loaiCongThucKey: new FormControl(),
      nhanSuChiuTrachNhiemKey: new FormControl(),
      phongBanKey: new FormControl(),
      donViTinhKey: new FormControl(),
      loaiKPIKey: new FormControl(),
      tanSuatTheoDoiKey: new FormControl(),
      trongSo: new FormControl(0),
      stt: new FormControl(0),
    })
  }

  get f() { return this.formGroup.controls; }

  /**
   * Get options
   */
  public getMucTieuOptions() {
    this.api.get('/api/danhsachkpi-dm/muc-tieu')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.mucTieuKey, label: m.mucTieuDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.mucTieuOptions = res;
        }
      });
  }

  /**
   * Get options
   */
  public getLoaiCongThucOptions() {
    this.api.get('/api/danhsachkpi-dm/loai-cong-thuc')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.loaiCongThucKey, label: m.loaiCongThucDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.loaiCongThucOptions = res;
        }
      });
  }

  /**
   * Get options
   */
  public getNhanSuChiuTrachNhiemOptions() {
    this.api.get('/api/danhsachkpi-dm/nhan-su-chiu-trach-nhiem')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.nhanSuChiuTrachNhiemKey, label: m.nhanSuChiuTrachNhiemDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.nhanSuChiuTrachNhiemOptions = res;
        }
      });
  }

  /**
   * Get options
   */
  public getPhongBanOptions() {
    this.api.get('/api/danhsachkpi-dm/phong-ban')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.phongBanKey, label: m.phongBanDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.phongBanOptions = res;
        }
      });
  }

  /**
   * Get options
   */
  public getDonViTinhOptions() {
    this.api.get('/api/danhsachkpi-dm/don-vi-tinh')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.donViTinhKey, label: m.donViTinhDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.donViTinhOptions = res;
        }
      });
  }

  /**
   * Get options
   */
  public getLoaiKPIOptions() {
    this.api.get('/api/danhsachkpi-dm/loai-kpi')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.loaiKPIKey, label: m.loaiKPIDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.loaiKPIOptions = res;
        }
      });
  }

  /**
   * Get options
   */
  public getTanSuatKPIOptions() {
    this.api.get('/api/danhsachkpi-dm/tan-suat-theo-doi')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.tanSuatTheoDoiKey, label: m.tanSuatTheoDoiDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.tanSuatKPIOptions = res;
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
        ...this.formGroup.value,
        thanhPhanKeys: this.thanhPhanTags?.map(m => m?.value)
      };
      // POST
      this.api.post(`/api/danhsachkpi-create`, params).subscribe(res => {
        if (res?.isSuccess) {
          swal({
            icon: "success",
            title: 'Thêm mới KPI mục tiêu thành công!',
            buttons: {
              ok: this.translate.instant('COMMON.btn.close'),
            },
          } as any).then(() => {
            this.isVisible = false;
            this.loadList.emit();
          });
        } else {
          this.api.errorMessage('Thêm mới KPI mục tiêu không thành công!');
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
      const params = {
        ...this.formGroup.value,
        kpiMucTieuId: this.dataModal?.kpiMucTieuId,
        thanhPhanKeys: this.thanhPhanTags?.map(m => m?.value)
      };
      // POST
      this.api.post(`/api/danhsachkpi-update`, params).subscribe(res => {
        if (res?.isSuccess) {
          swal({
            icon: "success",
            title: 'Cập nhật KPI mục tiêu thành công!',
            buttons: {
              ok: this.translate.instant('COMMON.btn.close'),
            },
          } as any).then(() => {
            this.isVisible = false;
            this.loadList.emit();
          });
        } else {
          this.api.errorMessage('Cập nhật KPI mục tiêu không thành công!');
        }
      }, err => this.api.errorMessage(err));
    }
  }

  private async bindingEdit() {
    await this.api.get('/api/danhsachkpi-update', { KPIMucTieuId: this.dataModal?.kpiMucTieuId }).toPromise().then((res) => {
      if (res) {
        this.formGroup.patchValue(res);
        this.thanhPhanTags = res?.thanhPhans?.map(m => ({ value: m?.thanhPhanKey, label: m?.thanhPhanDisplay }));
      }
    })
  }
}
