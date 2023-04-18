import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicAsideMenuService } from 'src/app/_metronic/core';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import swal from 'sweetalert';

@Component({
  selector: 'app-approve-registervehicle-modal',
  templateUrl: './approve-registervehicle-modal.component.html',
  styleUrls: ['./approve-registervehicle-modal.component.scss']
})
export class ApproveRegisterVehicleModalComponent implements OnInit {

  public isVisible: boolean;
  public formGroup: FormGroup;
  public dataDetail: any;
  public IsAccept: boolean;

  @Output() loadTimeLine = new EventEmitter();

  constructor(
    private api: ApiService,
    private cdf: ChangeDetectorRef,
    private menu: DynamicAsideMenuService,
  ) { }

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      ghiChu: new FormControl(''),
    })
  }

  get f() { return this.formGroup.controls; }

  public showModal(item: any, IsAccept: boolean = false) {
    this.dataDetail = item;
    this.IsAccept = IsAccept;
    this.isVisible = true;
    this.ngOnInit();
    this.checkRequired();
  }

  private checkRequired() {
    if (!this.IsAccept) {
      this.f['ghiChu'].setValidators([Validators.required]);
    } else {
      this.f['ghiChu'].clearValidators();
    }
    this.f['ghiChu'].updateValueAndValidity();
  }

  async onSubmitApprove() {
    this.formGroup.markAllAsTouched();

    if (this.formGroup.invalid) {
      return;
    }

    const url = this.IsAccept ? '/api/xeduadon-create/phe-duyet' : '/api/xeduadon-create/tu-choi';
    const bodyParams = {
      hoSoId: this.dataDetail?.hoSoId,
      ...this.formGroup?.value,
    }
    // POST
    this.api.post(url, bodyParams).subscribe(res => {
      if (res?.isSuccess) {
        swal({
          icon: "success",
          title: this.IsAccept == true ? "Phê duyệt yêu cầu thành công!" : "Từ chối yêu cầu thành công!",
          buttons: {
            ok: "Đóng"
          },
        } as any).then(() => {
          this.isVisible = false;
          this.loadTimeLine.emit();
          this.cdf.detectChanges();
          this.menu.loadBadgesMyJobInHomePage();
        });
      } else {
        this.api.errorMessage(null)
      }
    }, err => {
      this.api.errorMessage(err);
    });
  }
}
