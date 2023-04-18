import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import { Options } from 'src/app/_metronic/shared/shared/models/options';
import swal from 'sweetalert';
import { EKpiList } from '../../models/e-kpi.model';

@Component({
  selector: 'app-applying-formula-modal',
  templateUrl: './applying-formula-modal.component.html',
  styleUrls: ['./applying-formula-modal.component.scss'],
  exportAs: 'applying-formula'
})
export class ApplyingFormulaModalComponent implements OnInit {
  @Output() loadList = new EventEmitter;

  public isVisible: boolean;
  public formGroup: FormGroup;
  public dataDetail: EKpiList;

  public loaiCongThucOptions: Options[] = [];

  constructor(
    private api: ApiService,
    private translate: TranslateService,
  ) { }

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      congThucTinhThucTe: new FormControl(''),
      loaiCongThucKey: new FormControl(''),
    });
  }

  get f() { return this.formGroup.controls; }

  public async showModal(data?: EKpiList) {
    this.dataDetail = data;
    this.isVisible = true;
    this.ngOnInit();
    this.bindingForm();
    this.getLoaiCongThucOptions();
  }

  public getLoaiCongThucOptions() {
    this.api.get('/api/kpimuctieu-nam-bophan-dm/loai-cong-thuc')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m?.loaiCongThucKey, label: m?.loaiCongThucDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.loaiCongThucOptions = res;
        }
      });
  }

  // public getDetail(KPIMucTieuId) {
  //   this.api.get('/api/kpimuctieu-nam-bophan-update/kpi', { KPIMucTieuId: KPIMucTieuId })
  //     .subscribe((res: any) => {
  //       if (res) {
  //         this.dataDetail = res;
  //       }
  //     });
  // }

  /**
   * Submit+
   * Create
   */
  public onCreate() {
    this.formGroup.markAllAsTouched();
    if (!this.dataDetail?.congThucTinh?.kpiCongThucTinhId) {
      this.api.errorMessage('Không tìm thấy kpiCongThucTinhId!')
    } else if (this.formGroup.valid) {
      const params = {
        kpiCongThucTinhId: this.dataDetail?.congThucTinh?.kpiCongThucTinhId,
        ...this.formGroup.value
      }
      // Call api
      this.api.post(`/api/kpimuctieu-nam-bophan-update/ap-cong-thuc-kpi`, params).subscribe(
        res => {
          if (res?.isSuccess) {
            swal({
              icon: "success",
              title: 'Áp dụng công thức thành công!',
              buttons: {
                ok: this.translate.instant('COMMON.btn.close'),
              },
            } as any).then(() => {
              this.isVisible = false;
              this.loadList.emit();
            });
          } else {
            this.api.errorMessage('Áp dụng công thức không thành công!');
          }
        }, err => this.api.errorMessage(err));
    }
  }

  private bindingForm() {
    this.formGroup.patchValue({
      congThucTinhThucTe: this.dataDetail?.congThucTinh?.congThucTinhThucTe ?? '',
      loaiCongThucKey: this.dataDetail?.congThucTinh?.loaiCongThucKey ?? ''
    })
  }
}
