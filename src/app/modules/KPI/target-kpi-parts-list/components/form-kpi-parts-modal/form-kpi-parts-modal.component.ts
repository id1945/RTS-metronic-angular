import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import { Options } from 'src/app/_metronic/shared/shared/models/options';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import swal from 'sweetalert';

enum mode {
  create,
  additional,
  edit
}

declare type modeType = mode.create | mode.additional | mode.edit;

@Component({
  selector: 'app-form-kpi-parts-modal',
  templateUrl: './form-kpi-parts-modal.component.html',
  styleUrls: ['./form-kpi-parts-modal.component.scss'],
  exportAs: 'kpi-parts'
})
export class FormKpiPartsModalComponent implements OnInit {
  @Output() loadList = new EventEmitter();

  public mode: modeType;
  public isVisible: boolean;
  public formGroup: FormGroup;
  public phongBan: Options[] = [];
  public namOptions: Options[] = [];
  public boPhanOptions: Options[] = [];
  public nguoiPhuTrachOptions: Options[] = [];
  public KPIMucTieuNamBoPhanId: string;

  constructor(
    private api: ApiService,
    private translate: TranslateService,
  ) { }

  ngOnInit(): void {
    // Init form
    this.formGroup = new FormGroup({
      phongBanKey: new FormControl(null, Validators.required),
      namKey: new FormControl(null, Validators.required),
      tenBoKPI: new FormControl(''),
      nguoiPhuTrachKeys: new FormControl(null, Validators.required),
      ngayHieuLuc: new FormControl(''),
      expired: new FormControl(true),
    });
    // OnChange phongBanKey
    this.f?.phongBanKey?.statusChanges?.subscribe(res => {
      if (res) {
        this.getNguoiPhuTrachOptions(this.f.phongBanKey.value);
        this.getTenBoKPIOptions(this.f.phongBanKey.value, this.f.namKey.value, '');
      }
    });
    // OnChange namKey
    this.f?.namKey?.statusChanges?.subscribe(res => {
      if (res) {
        this.getTenBoKPIOptions(this.f.phongBanKey.value, this.f.namKey.value, '');
      }
    });
  }

  get f() { return this.formGroup.controls; }

  public async showModal(mode?: modeType, KPIMucTieuNamBoPhanId?: string) {
    this.mode = mode;
    this.isVisible = true;
    this.KPIMucTieuNamBoPhanId = KPIMucTieuNamBoPhanId;
    this.ngOnInit();
    // Load options
    this.getNamOptions();
    await this.getBoPhanOptions();
    // Edit mode
    if (KPIMucTieuNamBoPhanId) {
      this.bindingForEdit()
    }
  }

  /**
   * CREATE
   */
  public onCreate() {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    const params = {
      ...this.formGroup.value,
      ngayHieuLuc: ~~(new Date(this.f.ngayHieuLuc.value).getTime() / 1000),
      loaiDangKyKey: ''
    };

    let url;
    if (this.mode === mode.create) {
      url = '/api/kpimuctieu-nam-bophan-create';
    } else if (this.mode === mode.additional) {
      url = '/api/kpimuctieu-nam-bophan-create/bo-sung';
    }

    let msgSuccess, msgFail;
    if (this.mode === mode.create) {
      msgSuccess = 'Tạo mới KPI năm thành công!';
      msgFail = 'Tạo mới KPI năm không thành công!';
    } else if (this.mode === mode.additional) {
      msgSuccess = 'Tạo mới KPI năm bổ sung thành công!';
      msgFail = 'Tạo mới KPI năm bổ sung không thành công!';
    }

    this.api.post(url, params).subscribe(res => {
      if (res?.isSuccess) {
        // Message ok
        swal({
          icon: 'success',
          title: msgSuccess,
          buttons: {
            ok: this.translate.instant('COMMON.btn.close'),
          },
        } as any).then(() => {
          this.isVisible = false;
          this.loadList.emit();
        });
      } else {
        this.api.errorMessage(msgFail);
      }
    }, err => this.api.errorMessage(err));
  }

  /**
   * EDIT
   */
  public onEdit() {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    const params = {
      kpiMucTieuNamBoPhanId: this.KPIMucTieuNamBoPhanId,
      nguoiPhuTrachKeys: this.f.nguoiPhuTrachKeys.value,
      ngayHieuLuc: ~~(new Date(this.f.ngayHieuLuc.value).getTime() / 1000),
      expired: this.f.expired.value
    };

    this.api.post('/api/kpimuctieu-nam-bophan-update', params).subscribe(res => {
      if (res?.isSuccess) {
        // Message ok
        swal({
          icon: 'success',
          title: 'Cập nhật KPI năm thành công!',
          buttons: {
            ok: this.translate.instant('COMMON.btn.close'),
          },
        } as any).then(() => {
          this.isVisible = false;
          this.loadList.emit();
        });
      } else {
        this.api.errorMessage('Cập nhật KPI năm không thành công!');
      }
    }, err => this.api.errorMessage(err));
  }

  public getNamOptions() {
    this.api.get('/api/kpimuctieu-nam-bophan-dm/nam')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.namKey, label: m.namDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.namOptions = res;
        }
      })
  }

  public getTenBoKPIOptions(PhongBanKey, NamKey, LoaiDangKyKey) {
    const params = { PhongBanKey: PhongBanKey, NamKey: NamKey, LoaiDangKyKey: LoaiDangKyKey }
    this.api.get('/api/kpimuctieu-nam-bophan-create', params).subscribe((res: any) => {
      if (res) {
        this.formGroup.patchValue({ tenBoKPI: res?.tenBoKPI });
      }
    })
  }

  public async getBoPhanOptions() {
    this.boPhanOptions = await this.api.get('/api/kpimuctieu-nam-bophan-dm/phong-ban')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.phongBanKey, label: m.phongBanDisplay }))))).toPromise();
  }

  public async getNguoiPhuTrachOptions(phongBanKey) {
    if (phongBanKey) {
      const queryParam = {
        SearchText: '',
        PhongBanKey: phongBanKey
      }
      // Loading on
      this.api.loadingCustomOn();
      this.nguoiPhuTrachOptions = await this.api.getOffLoading('/api/kpimuctieu-nam-bophan-dm/nguoi-phu-trach', queryParam)
        .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.nguoiPhuTrachKey, label: m.nguoiPhuTrachDisplay }))))).toPromise();
      // Loading off
      this.api.loadingCustomOff();
    }
  }

  private async bindingForEdit() {
    const data = await this.api.get('/api/kpimuctieu-nam-bophan-update', { KPIMucTieuNamBoPhanId: this.KPIMucTieuNamBoPhanId }).toPromise();
    if (data) {
      this.formGroup.patchValue({
        phongBanKey: data?.phongBanKey,
        namKey: data?.namKey,
        tenBoKPI: data?.tenBoKPI,
        nguoiPhuTrachKeys: data?.nguoiPhuTrachs?.map(m => m?.nguoiPhuTrachKey),
        ngayHieuLuc: data?.ngayHieuLuc * 1000,
        expired: data?.expired ?? true
      });
    }
  }
}