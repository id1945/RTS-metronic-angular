import { Component, OnInit, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import swal from 'sweetalert'
import { ApiService } from 'src/app/_metronic/shared/http/api.service';

@Component({
  selector: 'app-approve-numberdocs-modal',
  templateUrl: './approve-numberdocs-modal.component.html',
  styleUrls: ['./approve-numberdocs-modal.component.scss']
})
export class ApproveNumberdocsModalComponent implements OnInit {

  public isVisible: boolean;
  public isSubmit: boolean;
  public formGroup: FormGroup;
  public dataDetail: any;
  public IsAccept: boolean;

  @Output() loadTimeLine = new EventEmitter();

  constructor(
    private api: ApiService,
    private cdf: ChangeDetectorRef,
    private translate: TranslateService,
  ) { }

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      ghiChu: new FormControl(''),
    })
  }

  get f() { return this.formGroup.controls; }

  public showModal(item, IsAccept: boolean = false) {
    this.dataDetail = item;
    this.IsAccept = IsAccept;
    this.isVisible = true;
    this.isSubmit = false;
    this.ngOnInit();
    this.checkRequired();
  }

  private checkRequired() {
    const stt = this.dataDetail?.lichSuPheDuyet?.items && this.dataDetail?.lichSuPheDuyet?.items[0];
    if (stt?.tinhTrangKey?.toLocaleLowerCase() === 'reject') {
      this.f['ghiChu'].setValidators([Validators.required]);
    } else {
      this.f['ghiChu'].clearValidators();
    }
    this.f['ghiChu'].updateValueAndValidity();
  }

  /**
   * Approve
   * @returns 
   */
  public onSubmitApprove() {

    this.isSubmit = true;
    if (this.formGroup.invalid) {
      return;
    }

    const bodyParams = {
      laySoVanBanId: this.dataDetail?.laySoVanBanId,
      noiDung: this.f.ghiChu.value
    };

    const url = this.IsAccept ? '/api/lay-so-vanban-create/phe-duyet' : '/api/lay-so-vanban-create/tu-choi';
    const title = this.IsAccept ? 'Duyệt lấy số văn bản thành công!' : 'Từ chối lấy số văn bản thành công!';
    const err = this.IsAccept ? 'Duyệt lấy số văn bản không thành công!' : 'Từ chối lấy số văn bản không thành công!';

    this.api.loadingCustomOn();
    this.api.post(url, bodyParams).subscribe(res => {
      if (res?.isSuccess) {
        swal({
          icon: 'success',
          title: title,
          buttons: {
            ok: this.translate.instant('COMMON.btn.close'),
          },
        } as any).then(() => {
          this.close();
          this.loadTimeLine.emit();
          this.cdf.detectChanges();
        });
      } else {
        this.api.errorMessage(err);
      }
      this.api.loadingCustomOff();
    }, err => {
      this.api.errorMessage(err);
      this.api.loadingCustomOff();
    });
  }

  private close() {
    this.isVisible = false;
    this.loadTimeLine.emit();
    this.cdf.detectChanges();
  }
}
