
import { Component, OnInit, ChangeDetectorRef, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import swal from 'sweetalert'
import { EventEmitter } from '@angular/core';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import { DynamicAsideMenuService } from 'src/app/_metronic/core';
import { SubmissionsDetail } from '../models/submissions-detail.model';

@Component({
  selector: 'app-approve-modal',
  templateUrl: './approve-modal.component.html',
  styleUrls: ['./approve-modal.component.scss']
})
export class ApproveModalComponent implements OnInit {

  public isVisible: boolean;
  public isSubmit: boolean;
  public formGroup: FormGroup;
  public dataDetail: SubmissionsDetail;
  public titleApporve :string;
  public placeHolderApporve : string;
  public mode: 'approve' | 'reject' | 'companion' | 'rejectCompanion';
  public hoSoId: string;

  @Output() loadTimeLine = new EventEmitter();

  constructor(
    private api: ApiService,
    private cdf: ChangeDetectorRef,
    private menu: DynamicAsideMenuService,
  ) { }

  ngOnInit(): void {
    this.isSubmit = false;
    this.formGroup = new FormGroup({
      ghiChu: new FormControl(''),
      ghiChuEng: new FormControl(''),
    })
  }

  get f() { return this.formGroup.controls; }

  public showModal(item: SubmissionsDetail, hoSoId: string, mode: 'approve' | 'reject' | 'companion' | 'rejectCompanion') {
    this.mode = mode;
    this.hoSoId = hoSoId;
    this.dataDetail = item;
    this.isVisible = true;
    this.ngOnInit();
    this.checkRequired();
  }

  private checkRequired() {
    if (this.mode === 'approve' ||this.mode === 'companion' ) {
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
    formData.append("HoSoId", this.hoSoId);
    formData.append("NoiDung", this.f?.ghiChu?.value);
    formData.append("NoiDungEng", this.f?.ghiChuEng?.value);

    const bodyParams = {
      HoSoId: this.hoSoId,
      NoiDung: this.f?.ghiChu?.value,
      NoiDungEng: this.f?.ghiChuEng?.value,
    }

    let title = '';
    let requestFinal;
    if (this.mode === 'approve') {
      title = "Bạn đã phê duyệt thành công!";
      requestFinal = this.api.post('/api/totrinh-duyetchi-pheduyet-list/phe-duyet', formData);
    } else if (this.mode === 'reject') {
      title = "Bạn đã từ chối thành công!";
      requestFinal = this.api.post('/api/totrinh-duyetchi-pheduyet-list/tu-choi', formData);
    } else if (this.mode === 'companion') {
      title = "Bạn đã đồng trình thành công!";
      requestFinal = this.api.post('/api/totrinh-duyetchi-pheduyet-list/xac-nhan-dong-trinh', formData);
    }
    else if (this.mode === 'rejectCompanion') {
      title = "Bạn đã từ chối thành công!";
      requestFinal = this.api.post('/api/totrinh-duyetchi-pheduyet-list/tu-choi-dong-trinh', formData);
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
          this.menu.loadBadgesMyJobInHomePage();
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
