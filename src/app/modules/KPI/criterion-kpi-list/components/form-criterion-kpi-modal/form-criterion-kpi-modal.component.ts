import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import swal from 'sweetalert';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';

@Component({
  selector: 'app-form-criterion-kpi-modal',
  templateUrl: './form-criterion-kpi-modal.component.html',
  styleUrls: ['./form-criterion-kpi-modal.component.scss'],
  exportAs: 'form-criterion-kpi'
})
export class FormCriterionKPIModalComponent implements OnInit {
  @Output() loadList = new EventEmitter;

  public formGroup: FormGroup;
  public isVisible: boolean;

  public dataDetail: any;

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
    this.dataDetail = item;
    this.initForm();
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
      maNhomTieuChi: new FormControl('', Validators.required),
      tenNhomTieuChi: new FormControl('', Validators.required),
      ghiChu: new FormControl(),
    })
  }

  get f() { return this.formGroup.controls; }

  /**
   * Submit+
   * Create
   */
  public onCreate() {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      // POST
      this.api.post(`/api/danhsachnhomtieuchi-create`, this.formGroup.value).subscribe(res => {
        if (res?.isSuccess) {
          swal({
            icon: "success",
            title: 'Thêm mới nhóm tiêu chi thành công!',
            buttons: {
              ok: this.translate.instant('COMMON.btn.close'),
            },
          } as any).then(() => {
            this.isVisible = false;
            this.loadList.emit();
          });
        } else {
          this.api.errorMessage('Thêm mới nhóm tiêu chi không thành công!');
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
        kpiNhomTieuChiId: this.dataDetail?.kpiNhomTieuChiId,
        ...this.formGroup.value,
      };
      // POST
      this.api.post(`/api/danhsachnhomtieuchi-update`, bodyParam).subscribe(res => {
        if (res?.isSuccess) {
          swal({
            icon: "success",
            title: 'Cập nhật nhóm tiêu chi thành công!',
            buttons: {
              ok: this.translate.instant('COMMON.btn.close'),
            },
          } as any).then(() => {
            this.isVisible = false;
            this.loadList.emit();
          });
        } else {
          this.api.errorMessage('Cập nhật nhóm tiêu chi không thành công!');
        }
      }, err => this.api.errorMessage(err));
    }
  }

  private bindingEdit() {
    this.api.get('/api/danhsachnhomtieuchi-update', { kpiNhomTieuChiId: this.dataDetail?.kpiNhomTieuChiId }).subscribe((res) => {
      if (res) {
        this.formGroup.patchValue(res);
      }
    }, err => this.api.errorMessage(err));
  }
}