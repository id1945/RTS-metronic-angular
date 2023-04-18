import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import swal from 'sweetalert';

@Component({
  selector: 'app-approve-parcel-modal',
  templateUrl: './approve-parcel-modal.component.html',
  styleUrls: ['./approve-parcel-modal.component.scss']
})
export class ApproveParcelModalComponent implements OnInit {


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
      ghiChu: new FormControl(''),
    })
  }

  get f() { return this.formGroup.controls; }

  public showModal(item: any, IsAccept: boolean) {
    this.dataDetail = item;
    this.IsAccept = IsAccept;
    this.isVisible = true;
    this.ngOnInit();
    this.checkRequired();
  }

  private checkRequired() { 
    this.f['ghiChu'].clearValidators();
  }

  async onSubmitApprove() {
    this.formGroup.markAllAsTouched();

    if (this.formGroup.invalid) {
      return;
    }

    const bodyParams = {
      buuPhamId: this.dataDetail?.buuPhamId,
      ...this.formGroup?.value,
    }
    // POST
    this.api.put('/api/buupham-update/da-chuyen', bodyParams).subscribe(res => {
      if (res) {
        swal({
          icon: "success",
          title: "Bạn đã xác nhận chuyển thành công!" ,
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
