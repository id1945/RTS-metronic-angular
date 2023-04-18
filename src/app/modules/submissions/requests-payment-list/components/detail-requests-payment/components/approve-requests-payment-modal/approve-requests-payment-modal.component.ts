import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicAsideMenuService } from 'src/app/_metronic/core';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import { SelectedFiles } from 'src/app/_metronic/shared/shared/services/files.service';
import swal from 'sweetalert';

@Component({
  selector: 'app-approve-requests-payment-modal',
  templateUrl: './approve-requests-payment-modal.component.html',
  styleUrls: ['./approve-requests-payment-modal.component.scss']
})
export class ApproveRequestsPaymentModalComponent implements OnInit {

  public isVisible: boolean;
  public formGroup: FormGroup;
  public dataDetail: any;
  public IsAccept: boolean;

  @Output() loadTimeLine = new EventEmitter();
  public selectedFiles: SelectedFiles[] = [];

  constructor(
    public api: ApiService,
    private cdf: ChangeDetectorRef,
    private menu: DynamicAsideMenuService,
  ) { }

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      noiDung: new FormControl(''),
      passCode: new FormControl(''),
    })
  }

  get f() { return this.formGroup.controls; }

  public showModal(item: any, IsAccept: boolean = false) {
    this.selectedFiles = [];
    this.dataDetail = item;
    this.IsAccept = IsAccept;
    this.isVisible = true;
    this.ngOnInit();
    this.checkRequired();
  }

  private checkRequired() {
    if (!this.IsAccept) {
      this.f['noiDung'].setValidators([Validators.required]);
    } else {
      this.f['noiDung'].clearValidators();
    }
    this.f['noiDung'].updateValueAndValidity();
  }

  async onSubmitApprove() {
    this.formGroup.markAllAsTouched();

    if (this.formGroup.invalid) {
      return;
    }

    const url = this.IsAccept ? '/api/denghi-thanhtoan-daily-create/phe-duyet' : '/api/denghi-thanhtoan-daily-create/tu-choi';

    const formData = new FormData();
    formData.append("HoSoId", this.dataDetail?.hoSoId);
    formData.append("NoiDung", this.f?.noiDung?.value);
    this.IsAccept && formData.append("PassCode", this.f?.passCode?.value);
    this.selectedFiles?.forEach(f => {
      formData.append("DinhKems", f.file);
    })

    // POST
    this.api.post(url, formData).subscribe(res => {
      if (res?.isSuccess) {
        swal({
          icon: "success",
          title: this.IsAccept == true ? "Phê duyệt yêu cầu thành công!" : "Từ chối yêu cầu thành công!",
          buttons: {
            ok: "Đóng"
          },
        } as any).then(() => {
          this.isVisible = false;
          this.menu.loadBadgesMyJobInHomePage();
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
