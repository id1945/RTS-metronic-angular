import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/modules/auth';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
const HEADER_ACCEPT = { headers: { 'Accept': 'application/json' } };
import { DatePipe } from '@angular/common';
import swal from 'sweetalert';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Options } from 'src/app/_metronic/shared/shared/models/options';

@Component({
  selector: 'app-form-explanation-modal',
  templateUrl: './form-explanation-modal.component.html',
  styleUrls: ['./form-explanation-modal.component.scss'],
  exportAs: 'element'
})
export class FormExplanationModalComponent implements OnInit {
  @Output() loadList = new EventEmitter;

  public isVisible = false;
  public userInfo: any;
  public dataDetail: any;
  public formGroup: FormGroup;

  public typeExplainOptions: Options[] = [];
  public typeReasonOptions: Options[] = [];

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private datepipe: DatePipe,
    private translate: TranslateService,
  ) { }

  ngOnInit(): void {
    this.userInfo = this.auth.currentUserValue;
    this.initForm();
  }

  public showModal(data) {
    this.isVisible = true;
    this.dataDetail = data;
    this.getTypeReasonOptions();
    this.getTypeExplainOptions();
    this.initForm();
  }

  private initForm() {
    this.formGroup = new FormGroup({
      SymbolId: new FormControl('', Validators.required),
      Reason_Id: new FormControl('', Validators.required),
      Remark: new FormControl('', Validators.required),
      FROMHOUR: new FormControl(null, Validators.required),
      TOHOUR: new FormControl(null, Validators.required),
    })
  }

  get f() { return this.formGroup.controls; }

  public onSubmit() {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }
    const bodyParams = {
      ...this.formGroup.value,
      FromDate: this.dataDetail?.WORKINGDAY,
      FROMHOUR: this.datepipe.transform(this.formGroup.value?.FROMHOUR, 'HH:mm'),
      TOHOUR: this.datepipe.transform(this.formGroup.value?.TOHOUR, 'HH:mm'),
    }
    this.api.post('/API/Mobile/TimeExplain', bodyParams, HEADER_ACCEPT).subscribe(res => {
      if (res?.ResponseStatus === 1) {
        swal({
          icon: 'success',
          title: 'Giải trình thành công!',
          buttons: {
            ok: this.translate.instant('COMMON.btn.close'),
          },
        } as any).then(() => {
          this.isVisible = false;
          this.loadList.emit();
        });
      } else {
        this.api.errorMessage(res?.Message);
      }
    }, err => this.api.errorMessage(err));
  }

  public getTypeExplainOptions() {
    this.api.post('/API/Mobile/TypeExplain', {}, HEADER_ACCEPT)
      .pipe(switchMap(s => of(s?.Items?.map((m: any) => ({ value: m?.ID, label: m?.MANUALLEAVE })))))
      .subscribe((res: any) => {
        if (res) {
          this.typeExplainOptions = res;
        }
      })
  }

  public getTypeReasonOptions() {
    this.api.post('/API/Mobile/TypeReason', {}, HEADER_ACCEPT)
      .pipe(switchMap(s => of(s?.Items?.map((m: any) => ({ value: m?.ID, label: m?.NAME_VN })))))
      .subscribe((res: any) => {
        if (res) {
          this.typeReasonOptions = res;
        }
      })
  }
}
