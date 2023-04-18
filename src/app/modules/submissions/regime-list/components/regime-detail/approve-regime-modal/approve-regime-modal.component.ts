
import { Component, OnInit, ChangeDetectorRef, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import swal from 'sweetalert'
import { EventEmitter } from '@angular/core';
import { Detail } from '../models/detail.model';
import { never, of } from 'rxjs';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';

@Component({
  selector: 'app-approve-regime-modal',
  templateUrl: './approve-regime-modal.component.html',
  styleUrls: ['./approve-regime-modal.component.scss']
})
export class ApproveRegimeModalComponent implements OnInit {

  public isVisible: boolean;
  public isSubmit: boolean;
  public formGroup: FormGroup;
  public dataDetail: Detail;
  public titleApporve :string;
  public placeHolderApporve : string;
  public mode: 'approve' | 'reject';
  public hoSoId: string;

  @Output() loadTimeLine = new EventEmitter();

  constructor(
    private api: ApiService,
    private cdf: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.isSubmit = false;
    this.formGroup = new FormGroup({
      ghiChu: new FormControl(''),
      ghiChuEng: new FormControl(''),
    })
  }

  get f() { return this.formGroup.controls; }

  public showModal(item: Detail, hoSoId: string, mode: 'approve' | 'reject') {
    this.mode = mode;
    this.hoSoId = hoSoId;
    this.dataDetail = item;
    this.isVisible = true;
    this.ngOnInit();
    this.checkRequired();
  }

  private checkRequired() {
    if (this.mode === 'approve'  ) {
      this.f['ghiChu'].clearValidators();
      this.f['ghiChuEng'].clearValidators();
      this.titleApporve = 'Xác nhận phê duyệt';
      this.placeHolderApporve ="Nhập nội dung phê duyệt";
    } else {
      this.f['ghiChu'].setValidators([Validators.required]);
      this.f['ghiChuEng'].setValidators([Validators.required]);
      this.titleApporve = 'Xác nhận từ chối';
      this.placeHolderApporve ="Nhập nội dung từ chối";
    }
    this.f['ghiChu'].updateValueAndValidity();
    this.f['ghiChuEng'].updateValueAndValidity();
  }

  onSubmitApprove() {
    this.isSubmit = true;
    if (this.formGroup.invalid) {
      return;
    }

    const formData = new FormData();
    formData.append("hoSoId", this.hoSoId);
    formData.append("noiDung", this.f?.ghiChu?.value);
    // formData.append("NoiDungEng", this.f?.ghiChuEng?.value);

    const bodyParams = {
      HoSoId: this.hoSoId,
      NoiDung: this.f?.ghiChu?.value,
      // NoiDungEng: this.f?.ghiChuEng?.value,
    }

    let title = '';
    let requestFinal;
    if (this.mode === 'approve') {
      title = "Bạn đã phê duyệt thành công!";
      requestFinal = this.api.post('/hoso-vanbandinhche-create/phe-duyet', bodyParams);
    } else if (this.mode === 'reject') {
      title = "Bạn đã từ chối thành công!";
      requestFinal = this.api.post('/hoso-vanbandinhche-create/tu-choi', bodyParams);
    } 

    requestFinal.subscribe(res => {
      if (res?.isSuccess) {
        swal({
          icon: "success",
          title: title,
          buttons: {
            ok: "Đóng"
          },
        } as any).then(() => {
          this.isVisible = false;
          this.loadTimeLine.emit();
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
