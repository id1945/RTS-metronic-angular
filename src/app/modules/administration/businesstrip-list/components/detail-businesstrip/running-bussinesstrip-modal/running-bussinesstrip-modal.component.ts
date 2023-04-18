import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import swal from 'sweetalert';

@Component({
  selector: 'app-running-bussinesstrip-modal',
  templateUrl: './running-bussinesstrip-modal.component.html',
  styleUrls: ['./running-bussinesstrip-modal.component.scss']
})
export class RunningBussinessTripModalComponent implements OnInit {

  public isVisible: boolean;
  public formGroup: FormGroup;
  public dataDetail: any;
  public IsAccept: boolean;

  @Output() loadTimeLine = new EventEmitter();

  constructor(
    private api: ApiService,
    private cdf: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      KmStart: new FormControl(''),
    })
  }

  get f() { return this.formGroup.controls; }

  public showModal(item: any) {
    this.dataDetail = item;
    this.isVisible = true;
    this.ngOnInit();
    this.checkRequired();
  }

  private checkRequired() {
    this.f['KmStart'].setValidators([Validators.required]);
  }

  async onSubmitApprove() {

    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    const url = '/api/chuyendi-update/len-xe';
    const bodyParams = {
      id: this.dataDetail?.id,
      ...this.formGroup?.value,
    }
    // POST
    this.api.post(url, bodyParams).subscribe(res => {
      if (res?.isSuccess) {
        swal({
          icon: "success",
          title: "Bạn đã cập nhật lên xe thành công!",
          buttons: {
            ok: "Đóng"
          },
        } as any).then(() => {
          this.isVisible = false;
          this.loadTimeLine.emit();
          this.cdf.detectChanges();
        });
      } else {
        this.api.errorMessage(null)
      }
    }, err => {
      this.api.errorMessage(err);
    });
  }
}
