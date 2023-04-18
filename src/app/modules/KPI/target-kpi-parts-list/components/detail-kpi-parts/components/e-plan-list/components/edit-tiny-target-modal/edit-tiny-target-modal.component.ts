import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import swal from 'sweetalert';

@Component({
  selector: 'app-edit-tiny-target-modal',
  templateUrl: './edit-tiny-target-modal.component.html',
  styleUrls: ['./edit-tiny-target-modal.component.scss'],
  exportAs: 'edit-tiny-target'
})
export class EditTinyTargetModalComponent implements OnInit {

  @Output() loadList = new EventEmitter();

  public isVisible: boolean;
  public formGroup: FormGroup;

  constructor(
    private api: ApiService,
    private translate: TranslateService,
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(node = null) {
    this.formGroup = new FormGroup({
      kpiKeHoachCongViecId: new FormControl(node?.id ?? ''),
      noiDungMucTieuNho: new FormControl(node?.name ?? '', Validators.required),
    });
  }

  get f() { return this.formGroup.controls; }

  public async showModal(id?: number) {
    this.isVisible = true;
    this.initForm(id);
  }

  /**
   * EDIT
   */
  public onEdit() {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      this.api.post('/api/kpimuctieu-nam-bophan-update/ke-hoach-cong-viec', this.formGroup.value).subscribe(res => {
        if (res?.isSuccess) {
          // Message ok
          swal({
            icon: 'success',
            title: 'Cập nhật mục tiêu nhỏ thành công!',
            buttons: {
              ok: this.translate.instant('COMMON.btn.close'),
            },
          } as any).then(() => {
            this.isVisible = false;
            this.loadList.emit();
          });
        } else {
          this.api.errorMessage('Cập nhật mục tiêu nhỏ không thành công!');
        }
      }, err => this.api.errorMessage(err));
    }
  }
}