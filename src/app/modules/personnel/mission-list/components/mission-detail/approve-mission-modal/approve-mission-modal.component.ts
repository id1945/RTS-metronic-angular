import { Component, OnInit, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import swal from 'sweetalert'
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import { MissionDetail } from '../../models/mission-detail.model';

@Component({
  selector: 'app-approve-mission-modal',
  templateUrl: './approve-mission-modal.component.html',
  styleUrls: ['./approve-mission-modal.component.scss']
})
export class ApproveMissionModalComponent implements OnInit {

  public isVisible: boolean;
  public isSubmit: boolean;
  public formGroup: FormGroup;
  public dataDetail: MissionDetail;
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

  public showModal(item: MissionDetail, IsAccept: boolean = false) {
    this.dataDetail = item;
    this.IsAccept = IsAccept;
    this.isVisible = true;
    this.isSubmit = false;
    this.ngOnInit();
    this.checkRequired();
  }

  private checkRequired() {
    const stt = this.dataDetail?.lichSuPheDuyet?.items && this.dataDetail?.lichSuPheDuyet?.items[0];
    if (!this.IsAccept) {
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
      hoSoId: this.dataDetail?.hoSoId,
      noiDung: this.f.ghiChu.value
    };

    const url = this.IsAccept ? '/api/dieudong-congtac-create/phe-duyet' : '/api/dieudong-congtac-create/tu-choi';
    const title = this.IsAccept ? 'Duyệt điều động công tác thành công!' : 'Từ chối điều động công tác thành công!';
    const err = this.IsAccept ? 'Duyệt điều động công tác không thành công!' : 'Từ chối điều động công tác không thành công!';

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
