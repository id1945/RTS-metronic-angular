import { Component, EventEmitter, OnInit, Output, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import { Options } from 'src/app/_metronic/shared/shared/models/options';
import swal from 'sweetalert';

@Component({
  selector: 'app-switch-approve-modal',
  templateUrl: './switch-approve-modal.component.html',
  styleUrls: ['./switch-approve-modal.component.scss'],
  exportAs: 'switch-approve'
})
export class SwitchApproveModalComponent implements OnInit {
  @Output() loadList = new EventEmitter;

  public isVisible: boolean;
  public formGroup: FormGroup;
  public kpiQuyId: number;
  public quyTrinhOptions: Options[] = [];

  constructor(
    private api: ApiService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      procedure: new FormControl(),
    })
  }

  get f() { return this.formGroup.controls; }

  public showModal(kpiQuyId = null) {
    this.kpiQuyId = kpiQuyId;
    this.isVisible = true;
    this.ngOnInit();
    this.getQuyTrinhOptions();
  }

  public getQuyTrinhOptions() {
    this.api.get('/api/kpiquy-dm/quy-trinh-duyet')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.quyTrinhDuyetKey, label: m.quyTrinhDuyetDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.quyTrinhOptions = res;
        }
      })
  }

  public onSubmit() {
    if (this.f.procedure.value) {
      const body = {
        kpiQuyId: this.kpiQuyId,
        quyTrinhDuyetKey: this.f.procedure.value
      };
      this.api.post('/api/kpiquy-update/loai-quy-trinh-duyet', body).subscribe(res => {
        if (res?.isSuccess) {
          swal({
            icon: "success",
            title: 'Cập nhật quy trình duyệt thành công!',
            buttons: {
              ok: this.translate.instant('COMMON.btn.close'),
            },
          } as any).then(() => {
            this.isVisible = false;
            this.loadList.emit();
          });
        } else {
          this.api.errorMessage('Cập nhật quy trình duyệt không thành công!');
        }
      }, err => this.api.errorMessage(err));
    }
  }
}
