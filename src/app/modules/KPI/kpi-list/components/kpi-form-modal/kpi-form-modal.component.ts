import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import { Options } from 'src/app/_metronic/shared/shared/models/options';
import swal from 'sweetalert';

@Component({
  selector: 'app-kpi-form-modal',
  templateUrl: './kpi-form-modal.component.html',
  styleUrls: ['./kpi-form-modal.component.scss'],
  exportAs: 'kpi-form'
})
export class KpiFormModalComponent implements OnInit {

  @Output() loadList = new EventEmitter;

  public isVisible: boolean;
  public formGroup: FormGroup;

  public phongBanOptions: Options[] = [];
  public mucTieuOptions: Options[] = [];
  public nguoiPhuTrachOptions: Options[] = [];
  public truongBoPhanOptions: Options[] = [];
  public quyOptions: Options[] = [];

  constructor(
    private api: ApiService,
    private translate: TranslateService,
  ) { }

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      phongBanKey: new FormControl(null, Validators.required),
      mucTieuKey: new FormControl(null, Validators.required),
      nam: new FormControl('', Validators.required),
      quyKey: new FormControl(null, Validators.required),
      nguoiPhuTrachKey: new FormControl(''),
      truongBoPhanKey: new FormControl(''),
    });
    // OnChange phongBan
    this.mucTieuOptions = [];
    this.nguoiPhuTrachOptions = [];
    this.truongBoPhanOptions = [];
    this.f.phongBanKey.valueChanges.subscribe(res => {
      if (res) {
        this.getMucTieuOptions(res);
        this.getPhuTrachOptions(res);
        this.getTruongBoPhanOptions(res);
      }
    })
  }

  get f() { return this.formGroup.controls; }

  public async showModal() {
    this.isVisible = true;
    this.ngOnInit();
    // Load options
    await this.getPhongBans('');
    this.getQuyOptions();
  }

  public async getPhongBans(SearchText) {
    this.phongBanOptions = await this.api.get('/api/kpiquy-dm/phong-ban', { SearchText: SearchText })
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.phongBanKey, label: m.phongBanDisplay }))))).toPromise();
  }

  public getMucTieuOptions(PhongBanKey) {
    this.api.get('/api/kpiquy-dm/muc-tieu', { PhongBanKey: PhongBanKey })
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.mucTieuKey, label: m.mucTieuDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.mucTieuOptions = res;
        }
      })
  }

  public getPhuTrachOptions(PhongBanKey) {
    this.api.get('/api/kpiquy-dm/nguoi-phu-trach', { PhongBanKey: PhongBanKey })
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.nguoiPhuTrachKey, label: m.nguoiPhuTrachDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.nguoiPhuTrachOptions = res;
        }
      })
  }

  public getTruongBoPhanOptions(PhongBanKey) {
    this.api.get('/api/kpiquy-dm/truong-bo-phan', { PhongBanKey: PhongBanKey })
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.truongBoPhanKey, label: m.truongBoPhanDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.truongBoPhanOptions = res;
        }
      })
  }

  public getQuyOptions() {
    this.api.get('/api/kpiquy-dm/quy')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.quyKey, label: m.quyDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.quyOptions = res;
        }
      })
  }

  /**
   * Submit+
   * Create
   */
  public onCreate() {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      // Call api
      this.api.post(`/api/kpiquy-create`, this.formGroup.value).subscribe(
        res => {
          if (res?.isSuccess) {
            swal({
              icon: "success",
              title: 'Thêm mới KPI quý thành công!',
              buttons: {
                ok: this.translate.instant('COMMON.btn.close'),
              },
            } as any).then(() => {
              this.isVisible = false;
              this.loadList.emit();
            });
          } else {
            this.api.errorMessage('Thêm mới KPI quý không thành công!');
          }
        }, err => this.api.errorMessage(err));
    }
  }
}
