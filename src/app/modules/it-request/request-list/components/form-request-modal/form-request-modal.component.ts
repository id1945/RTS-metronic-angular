import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/modules/auth';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import { Options } from 'src/app/_metronic/shared/shared/models/options';
import swal from 'sweetalert';

@Component({
  selector: 'app-form-request-modal',
  templateUrl: './form-request-modal.component.html',
  styleUrls: ['./form-request-modal.component.scss'],
  exportAs: 'form-it-request'
})
export class FormRequestModalComponent implements OnInit {

  @Output() loadList = new EventEmitter;

  public isVisible = false;
  public formGroup: FormGroup;
  public serviceOptions: Options[] = [];
  public dataDetail: any;
  public mode: number;

  constructor(
    private api: ApiService,
    private datepipe: DatePipe,
    private auth: AuthService,
    private translate: TranslateService,
  ) {
  }

  ngOnInit() {
    this.initForm();
  }
  
  public showModal(data = null, mode: number) {
    this.mode = mode;
    this.isVisible = true;
    this.dataDetail = data;
    this.ngOnInit();
    this.getServiceOptions();
  }

  public initForm() {
    this.formGroup = new FormGroup({
      service_id: new FormControl(this.dataDetail ? this.dataDetail?.service_id : ''),
      name: new FormControl(this.dataDetail ? this.dataDetail?.name : ''),
      description: new FormControl(this.dataDetail ? this.dataDetail?.description : ''),
    })
  }

  public get f() { return this.formGroup.controls; }

  public onCreate() {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      const body = {
        ...this.formGroup.value,
        partner_email: this.auth.currentUserValue.email,
        partner_name: this.auth.currentUserValue.hoTen,
        deadline: this.datepipe.transform(new Date(),'yyyy-MM-dd HH:mm'),
      };
      this.api.post('/tcm_ticket/create_ticket', body).subscribe(res => {
        if (res?.result?.status === 201) {
          swal({
            icon: "success",
            title: 'Tạo mới yêu cầu hỗ trợ thành công!',
            buttons: {
              ok: this.translate.instant('COMMON.btn.close'),
            },
          } as any).then(() => {
            this.isVisible = false;
            this.loadList.emit();
          });
        } else {
          this.api.errorMessage(res?.result?.message);
        }
      }, err => {
        this.api.errorMessage(err);
      });
    }
  }

  public onEdit() {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      const body = {
        ...this.formGroup.value,
        ticket_id: this.dataDetail?.id,
        partner_email: this.auth.currentUserValue.email,
        partner_name: this.auth.currentUserValue.hoTen,
        deadline: this.datepipe.transform(new Date(), 'yyyy-MM-dd HH:mm'),
      };
      this.api.post('/tcm_ticket/update_ticket', body).subscribe(res => {
        if (res?.result?.status === 201) {
          swal({
            icon: "success",
            title: 'Cập nhật yêu cầu hỗ trợ thành công!',
            buttons: {
              ok: this.translate.instant('COMMON.btn.close'),
            },
          } as any).then(() => {
            this.isVisible = false;
            this.loadList.emit();
          });
        } else {
          this.api.errorMessage(res?.result?.message);
        }
      }, err => {
        this.api.errorMessage(err);
      });
    }
  }

  /**
   * Approve/Reject
   * @param isReject 
   */
  public onApprove(isReject) {
    if (this.dataDetail?.is_approve) {
      const body = {
        ticket_id: this.dataDetail?.id,
        action: isReject ? 'not_approve' : "approved"
      };
      this.api.post('/tcm_ticket/approve_ticket', body).subscribe(res => {
        if (res?.result?.status === 201) {
          swal({
            icon: "success",
            title: isReject ? 'Huỷ duyệt yêu cầu hỗ trợ thành công!' : 'Duyệt yêu cầu hỗ trợ thành công!',
            buttons: {
              ok: this.translate.instant('COMMON.btn.close'),
            },
          } as any).then(() => {
            this.isVisible = false;
            this.loadList.emit();
          });
        } else {
          this.api.errorMessage(res?.result?.message);
        }
      }, err => {
        this.api.errorMessage(err);
      });
    }
  }

  public getServiceOptions() {
    this.api.get('/tcm_ticket/get_ticket_service?page_number=1&limit_number=20')
      .pipe(switchMap(s => of(s?.result?.service_list?.map((m: any) => ({ value: m.id, label: m.name })))))
      .subscribe((res: any) => {
        if (res) {
          this.serviceOptions = res;
        }
      })
  }
}