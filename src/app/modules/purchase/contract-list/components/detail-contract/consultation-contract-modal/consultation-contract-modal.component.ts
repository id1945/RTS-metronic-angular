import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { configTextEditor } from 'src/app/_metronic/shared/shared/common/helper';
import { TranslateService } from '@ngx-translate/core';
import swal from 'sweetalert';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import { PurchaseContactDetail } from '../../../models/purchase-contact-detail.model';

@Component({
  selector: 'app-consultation-contract-modal',
  templateUrl: './consultation-contract-modal.component.html',
  styleUrls: ['./consultation-contract-modal.component.scss']
})
export class ConsultationContractModalComponent implements OnInit {

  public isVisible: boolean;
  public formGroup: FormGroup;
  private noiDungThuKiThamVans: FormArray;
  public dataDetail: PurchaseContactDetail;
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
      noiDungThuKiThamVans: this.fb.array([this.createItem()])
    })
  }

  get f() { return this.formGroup.controls; }

  public showModal(item) {
    this.dataDetail = item;
    this.isVisible = true;
    this.validate();
    this.bindingThamVan();
  }

  /**
   * Binding
   */
  private bindingThamVan() {
    this.noiDungThuKiThamVans = this.f['noiDungThuKiThamVans'] as FormArray;
    this.dataDetail?.thamVan?.noiDungThuKiThamVans?.forEach((el) => {
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
    if (this.f['noiDungThuKiThamVans']?.value?.length > 1) {
      (this.f['noiDungThuKiThamVans'] as FormArray).removeAt(idx);
    }
  }

  public onSubmit() {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {

      const bodyPramasThamVan = {
        ...this.formGroup?.value,
        idDeNghi: this.dataDetail?.idDeNghi,
        noiDungThuKiThamVans: this.formGroup?.value?.noiDungThuKiThamVans?.map(m => ({
          lineId: m?.lineId ?? null,
          content: m?.noiDungThamVan
        })),
      }

      this.api.post('/api/purchase-contract-create/tham-van', bodyPramasThamVan).subscribe(res => {
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
      }, err => {
        this.api.errorMessage(err);
      });
    }
  }
}
