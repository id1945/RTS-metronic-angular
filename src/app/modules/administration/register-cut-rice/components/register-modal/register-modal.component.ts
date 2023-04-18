import { Component, EventEmitter, OnInit, Output, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import serialize from '@octetstream/object-to-form-data';
import swal from 'sweetalert';
@Component({
  selector: 'app-register-modal',
  templateUrl: './register-modal.component.html',
  styleUrls: ['./register-modal.component.scss'],
  exportAs: 'register'
})
export class RegisterModalComponent implements OnInit {

  @Output() loadList = new EventEmitter();
  public isVisible = false;
  public formGroup: FormGroup;
  public dateSelected: Date[] = [];

  constructor(
    private api: ApiService,
    private cdf: ChangeDetectorRef,
    public translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm() {
    this.formGroup = new FormGroup({
      LyDo: new FormControl('', Validators.required),
    })
  }

  public showModal(date: Date[] = []) {
    this.dateSelected = date;
    this.initForm();
    this.isVisible = true;
    this.cdf.detectChanges();
  }

  get f() { return this.formGroup.controls; }

  public onSubmit() {
    // Validate
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    // Params - multipart/form-data (serialize)
    const params = serialize({
      LyDo: this.f.LyDo?.value,
      NgayThucHiens: this.dateSelected.map(m => Math.floor(new Date(m).getTime() / 1000))
    });

    // Request post
    this.api.post('/api/dangky-catcom-create', params).subscribe(res => {
      if (res?.isSuccess) {
        swal({
          icon: 'success',
          title: `Đăng ký cắt cơm thành công!`,
          buttons: {
            ok: this.translate.instant('COMMON.btn.close'),
          },
        } as any).then(() => {
          this.onClose();
          this.loadList.emit();
        });
      } else {
        this.api.errorMessage('Đăng ký cắt cơm không thành công!');
      }
    }, err => this.api.errorMessage(err));
  }

  public onClose() {
    this.isVisible = false;
  }
}
