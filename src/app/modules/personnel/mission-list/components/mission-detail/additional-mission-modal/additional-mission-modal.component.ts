import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import serialize from '@octetstream/object-to-form-data';
import swal from 'sweetalert';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import { configTextEditor } from 'src/app/_metronic/shared/shared/common/helper';

@Component({
  selector: 'app-additional-mission-modal',
  templateUrl: './additional-mission-modal.component.html',
  styleUrls: ['./additional-mission-modal.component.scss'],
  exportAs: 'additional-mission'
})
export class AdditionalMissionModalComponent implements OnInit {

  @Output() loadDetail = new EventEmitter();
  // Config TextEditor
  public config = configTextEditor;
  public isVisible = false;
  public formGroup: FormGroup;
  public HoSoId: number;

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.formGroup = new FormGroup({
      ThongTinDatVe: new FormControl(),
      ThongTinKhachSan: new FormControl()
    })
  }

  get f() { return this.formGroup.controls; }

  public showModal(HoSoId: number) {
    this.isVisible = true;
    this.HoSoId = HoSoId;
    this.initForm();
  }

  public onSubmit() {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      const formData = serialize({
        HoSoId: this.HoSoId,
        ...this.formGroup.value
      });
      // POST
      this.api.post('/api/dieudong-congtac-update/bo-sung', formData).subscribe(res => {
        if (res?.isSuccess) {
          swal({
            icon: "success",
            title: "Yêu cầu bổ sung thông tin thành công.",
            buttons: {
              ok: "Đóng"
            },
          } as any).then(() => {
            this.isVisible = false;
            this.loadDetail.emit();
          });
        } else {
          this.api.errorMessage('Yêu cầu bổ sung thông tin không thành công!');
        }
      }, err => {
        this.api.errorMessage(err);
      });
    }
  }
}
