import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import swal from 'sweetalert';

@Component({
  selector: 'app-reject-modal',
  templateUrl: './reject-modal.component.html',
  styleUrls: ['./reject-modal.component.scss'],
  exportAs: 'reject'
})
export class RejectModalComponent implements OnInit {

  @Output() loadList = new EventEmitter();
  public isVisible = false;
  public formGroup: FormGroup;

  constructor(
    private api: ApiService,
    private translate: TranslateService,
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(congViecId = 0) {
    this.formGroup = new FormGroup({
      congViecId: new FormControl(congViecId),
      reasonCancel: new FormControl('', Validators.required)
    })
  }

  get f() { return this.formGroup.controls; }

  public showModal(item) {
    this.isVisible = true;
    this.initForm(item?.congViecId);
  }

  public onTuChoi() {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return false;
    }
    // Request
    this.api.post('/api/lich-lam-viec-update/huy-lich-hop', this.formGroup.value).subscribe(res => {
      if (res?.isSuccess) {
        swal({
          icon: 'success',
          title: 'Huỷ lịch họp thành công!',
          buttons: {
            ok: this.translate.instant('COMMON.btn.close'),
          },
        } as any).then(() => {
          this.isVisible = false;
          this.loadList.emit();
        });
      } else {
        this.api.errorMessage('Huỷ lịch họp không thành công!');
      }
    }, err => this.api.errorMessage(err));
  }
}
