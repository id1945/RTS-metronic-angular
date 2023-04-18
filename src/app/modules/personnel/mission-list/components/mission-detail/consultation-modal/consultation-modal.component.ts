import { TranslateService } from '@ngx-translate/core';
import swal from 'sweetalert'
import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core'
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms'
import { configTextEditor } from 'src/app/_metronic/shared/shared/common/helper';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';

@Component({
  selector: 'app-consultation-modal',
  templateUrl: './consultation-modal.component.html',
  styleUrls: ['./consultation-modal.component.scss']
})
export class ConsultationModalComponent implements OnInit {

  public isVisible: boolean;
  public isSubmit: boolean;
  public formGroup: FormGroup;
  private noiDungThuKiThamVans: FormArray;
  public dataDetail: any;
  public config = configTextEditor;
  public checkBLDDuyet: any;

  @Output() loadTimeLine = new EventEmitter();

  constructor(
    private api: ApiService,
    private fb: FormBuilder,
    private cdf: ChangeDetectorRef,
    private translate: TranslateService,
  ) {
  }

  ngOnInit(): void {
    this.validate();
  }

  private validate() {
    this.formGroup = this.fb.group({
      noiDungTrinhKi: ['', Validators.required],
      noiDungKiemTra: ['', Validators.required],
      noiDungThuKiThamVans: this.fb.array([])
    })
  }

  get f() { return this.formGroup.controls; }

  public showModal(item) {
    this.dataDetail = item;
    this.isVisible = true;
    this.isSubmit = false;
    this.validate();
    this.bindingThamVan();
  }

  private bindingThamVan() {
    this.noiDungThuKiThamVans = this.f['noiDungThuKiThamVans'] as FormArray;
    this.dataDetail?.thamVan?.noiDungThuKiThamVans?.forEach(el => {
      if (el) {
        this.noiDungThuKiThamVans.push(this.createItem(el));
      }
    });
    this.f.noiDungTrinhKi.setValue(this.dataDetail?.thamVan?.noiDungTrinhKi);
    this.f.noiDungKiemTra.setValue(this.dataDetail?.thamVan?.noiDungKiemTra);
  }

  public createItem(el = null) {
    return this.fb.group({
      lineId: el?.lineId ?? null,
      noiDungThamVan: [el?.noiDungThamVan ?? '', Validators.required]
    })
  }

  public addItem() {
    this.noiDungThuKiThamVans = this.f['noiDungThuKiThamVans'] as FormArray;
    this.noiDungThuKiThamVans.push(this.createItem());
  }

  public removeItem(idx: number): void {
    (this.f['noiDungThuKiThamVans'] as FormArray).removeAt(idx);
  }

  public onSubmit() {
    this.isSubmit = true;

    if (this.formGroup.invalid) {
      return;
    }

    const bodyPramasThamVan = {
      ...this.formGroup?.value,
      idYCMH: this.dataDetail?.id,
      noiDungThuKiThamVans: this.formGroup?.value?.noiDungThuKiThamVans?.map(m => ({
        lineId: m?.lineId ?? null,
        content: m?.noiDungThamVan
      })),
    }

    this.api.post('/api/purchase-product-update/tham-van', bodyPramasThamVan).subscribe(res => {
      if (res) {
        swal({
          icon: "success",
          title: 'Tạo thông tin tham vấn thành công!',
          buttons: {
            ok: this.translate.instant('COMMON.btn.close'),
          },
        } as any).then(() => {
          this.isVisible = false;
          this.loadTimeLine.emit();
          this.cdf.detectChanges();
        });
      }
    }, err => this.api.errorMessage(err));
  }

}
