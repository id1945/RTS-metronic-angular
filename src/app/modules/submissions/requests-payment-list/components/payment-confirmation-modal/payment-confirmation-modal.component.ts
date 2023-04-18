import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import swal from 'sweetalert';

@Component({
  selector: 'app-payment-confirmation-modal',
  templateUrl: './payment-confirmation-modal.component.html',
  styleUrls: ['./payment-confirmation-modal.component.scss']
})
export class PaymentConfirmationModalComponent implements OnInit {

  @Output() loadList = new EventEmitter();

  public isVisible = false;
  public formGroup: FormGroup;

  public dataRow: any;

  constructor(
    private api: ApiService,
    private cdf: ChangeDetectorRef,
    private translate: TranslateService,
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm() {
    this.formGroup = new FormGroup({
      ngayThanhToan: new FormControl(''),
      soChungTuNoiBo: new FormControl('')
    })
  }

  get f() { return this.formGroup.controls; }

  public showModal(dataRow = null) {
    this.isVisible = true;
    this.dataRow = dataRow;
    this.initForm();
  }

  public onSubmit(): void {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return
    }

    let params = {
      ...this.formGroup?.value,
      hoSoId: this.dataRow?.hoSoId,
      soChungTu: this.dataRow?.soChungTu
    }

    this.api.post('/api/denghi-thanhtoan-daily-update/xacnhan-thanhtoan', params).subscribe(res => {
      if (res?.isSuccess) {
        swal({
          icon: 'success',
          title: 'Xác nhận thanh toán thành công.',
          buttons: {
            ok: this.translate.instant('COMMON.btn.close'),
          },
        } as any).then(() => {
          this.isVisible = false;
          this.loadList.emit();
          this.cdf.detectChanges();
        });
      } else {
        this.api.errorMessage(null);
      }
    }, err => {
      this.api.errorMessage(err);
    });
  }
}
