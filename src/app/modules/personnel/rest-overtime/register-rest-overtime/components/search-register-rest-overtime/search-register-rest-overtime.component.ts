import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Params } from '@angular/router';
import { Options } from 'src/app/_metronic/shared/shared/models/options';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RegisterRestService } from 'src/app/modules/personnel/rest-overtime/shared/register-rest.service';
import { UserPosition } from '../../../shared/register-rest.model';
import { DatePipe } from '@angular/common';
import { PER_SCREEN } from '../../../shared/constant';
const HEADER_ACCEPT = { headers: { 'Accept': 'application/json' } };
import swal from 'sweetalert';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-search-register-rest-overtime',
  templateUrl: './search-register-rest-overtime.component.html',
  styleUrls: ['./search-register-rest-overtime.component.scss'],
  exportAs: 'search'
})
export class SearchRegisterRestOvertimeComponent implements OnInit, OnChanges {

  @Input() params: Params;

  public formGroup1: FormGroup;
  public formGroup2: FormGroup;
  public formGroup3: FormGroup;

  public data: any[] = [];
  public recipientSelected: UserPosition;
  public PER_SCREEN = PER_SCREEN;
  // public disabledDate = (current: Date): boolean => differenceInCalendarDays(current, new Date()) < 0; //Eg: [nzDisabledDate]="disabledDate" 

  /**
   * ======================================
   * Đăng ký nghỉ
   * ======================================
   */
  public holidayTypeOptions: Options[] = [];

  /**
   * ======================================
   * Đăng ký làm thêm
   * ======================================
   */
  public time: Date | null = null;

  /**
   * ======================================
   * Đăng ký nghỉ không lương dưới nửa ngày
   * ======================================
   */
  public typeWLEOOptions: Options[] = [];
  public reasonWLEOOptions: Options[] = [];

  constructor(
    private api: ApiService,
    private datepipe: DatePipe,
    private translate: TranslateService,
    public registerRest: RegisterRestService,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.fetchTypeLeave();
    this.fetchTypeWLEO();
    this.fetchReasonWLEO();
    this.initForm();
  }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm() {
    this.formGroup1 = new FormGroup({
      TYPELEAVE: new FormControl('', Validators.required),
      FROMDATE: new FormControl(null, Validators.required),
      TODATE: new FormControl(null, Validators.required),
      NOTE: new FormControl('', Validators.required),
      IS_DOTXUAT: new FormControl(false),
      RECIPIENT: new FormControl(''),
    });
    this.formGroup2 = new FormGroup({
      FromHour: new FormControl(null, Validators.required),
      ToHour: new FormControl(null, Validators.required),
      Remark: new FormControl('', Validators.required),
      IS_QUENCHAMCONG: new FormControl(false),
    });
    this.formGroup3 = new FormGroup({
      TYPEREGISTERID: new FormControl('', Validators.required),
      FROMHOUR: new FormControl(null, Validators.required),
      TOHOUR: new FormControl(null, Validators.required),
      REASONID: new FormControl('', Validators.required),
      NOTE: new FormControl(''),
      ReTime: new FormControl(0),
    });
    this.f3.REASONID.valueChanges.subscribe(value => {
      if (value) {
        this.f3.NOTE.setValue(this.reasonWLEOOptions.find(f => f.value === value)?.label);
      }
    });
    this.CalcHours();
  }

  get f1() { return this.formGroup1.controls; }
  get f2() { return this.formGroup2.controls; }
  get f3() { return this.formGroup3.controls; }

  // Emit Status
  public onChangeStatus(value: any, idx: number): void {
    this.registerRest.searchParams$.next({
      ...this.registerRest.searchParams$.value,
      Status: value?.join(',')
    })
  }

  /**
   * ======================================
   * Đăng ký nghỉ
   * ======================================
   */

  private fetchTypeLeave() {
    const headers = { headers: { 'Accept': 'application/json' } };
    this.api.post('/API/Mobile/TypeLeave', {}, headers)
      .pipe(switchMap(s => of(s?.Items?.map((m: any) => ({ value: m?.ID?.toString(), label: m?.MANUALLEAVE })))))
      .subscribe(res => {
        if (res) {
          this.holidayTypeOptions = res;
        }
      })
  }


  /**
   * =======================================
   * Đăng ký nghỉ không lương dưới nửa ngày
   * =======================================
   */

  private fetchTypeWLEO() {
    const headers = { headers: { 'Accept': 'application/json' } };
    this.api.post('/API/Mobile/TypeWLEO', {}, headers)
      .pipe(switchMap(s => of(s?.Items?.map((m: any) => ({ value: m?.ID?.toString(), label: m?.NAME })))))
      .subscribe(res => {
        if (res) {
          this.typeWLEOOptions = res;
        }
      })
  }

  private fetchReasonWLEO() {
    const headers = { headers: { 'Accept': 'application/json' } };
    this.api.post('/API/Mobile/ReasonWLEO', {}, headers)
      .pipe(switchMap(s => of(s?.Items?.map((m: any) => ({ value: m?.ID?.toString(), label: m?.NAME })))))
      .subscribe(res => {
        if (res) {
          this.reasonWLEOOptions = res;
        }
      })
  }

  // Thời gian đăng ký
  public CalcHours() {
    const calculator = () => {
      const start = new Date(this.f3.FROMHOUR?.value).getTime();
      const end = new Date(this.f3.TOHOUR?.value).getTime();
      if (end > start) {
        const diff = Math.abs(end - start);
        const minutes = Math.round(diff / 60000) + ' Phút';
        this.f3.ReTime.setValue(minutes);
      } else {
        this.f3.ReTime.setValue(180 + ' Phút');
      }
    }
    this.f3.FROMHOUR.valueChanges.subscribe(value => {
      calculator();
    });
    this.f3.TOHOUR.valueChanges.subscribe(value => {
      calculator();
    });
  }

  /**
   * ///////////////////////////////////
   * /////////ACTION ON CALENDAR////////
   * ///////////////////////////////////
   * 
   * // REGISTER + APPROVE - Đăng ký + gửi duyệt: isRegiterAndApprove = true
   * // Đăng ký: isRegiterAndApprove = false
   * @param date 
   * @returns 
   */
  public onRegister(isRegiterAndApprove = false): boolean {

    if (this.params?.screen == PER_SCREEN.HOLIDAY) {
      // VALIDATE
      if (this.f1?.TYPELEAVE.errors) {
        this.api.errorMessage(`Chưa chọn loại nghỉ!`);
      } else if (this.f1?.FROMDATE?.errors) {
        this.api.errorMessage(`Chưa nhập ngày từ ngày!`);
      } else if (this.f1?.TODATE?.errors) {
        this.api.errorMessage(`Chưa nhập ngày đến ngày!`);
      } else if (this.f1?.NOTE?.errors) {
        this.api.errorMessage(`Chưa nhập lý do!`);
      }
      if (this.formGroup1.invalid) {
        return false;
      }
    }

    if (this.params?.screen == PER_SCREEN.OVERTIME) {
      // VALIDATE
      if (this.f2?.FromHour?.errors) {
        this.api.errorMessage(`Chưa chọn từ giờ!`);
      } else if (this.f2?.ToHour?.errors) {
        this.api.errorMessage(`Chưa chọn đến giờ!`);
      } else if (this.f2?.Remark?.errors) {
        this.api.errorMessage(`Chưa nhập lý do!`);
      }
      if (this.formGroup2.invalid) {
        return false;
      }
    }

    if (this.params?.screen == PER_SCREEN.WLEO) {
      // VALIDATE
      if (this.f3?.TYPEREGISTERID?.errors) {
        this.api.errorMessage(`Chưa chọn loại đi muộn về sớm!`);
      } else if (this.f3?.FROMHOUR?.errors) {
        this.api.errorMessage(`Chưa chọn từ giờ!`);
      } else if (this.f3?.TOHOUR?.errors) {
        this.api.errorMessage(`Chưa chọn đến giờ!`);
      } else if (this.f3?.REASONID?.errors) {
        this.api.errorMessage(`Chưa chọn lý do!`);
      }
      if (this.formGroup3.invalid) {
        return false;
      }
    }

    // UPDATE BODY PARAMS
    let url = null;
    let bodyParams = null;
    switch (this.params?.screen) {
      case PER_SCREEN.HOLIDAY:
        url = '/API/Mobile/RegisterLeave';
        bodyParams = {
          LEAVEFROM: this.datepipe.transform(new Date(this.f1?.FROMDATE?.value), 'yyyy-MM-dd'),
          LEAVETO: this.datepipe.transform(new Date(this.f1?.TODATE?.value), 'yyyy-MM-dd'),
          IS_DOTXUAT: this.f1?.IS_DOTXUAT?.value ? '-1' : '0',
          NOTE: this.f1?.NOTE?.value,
          TYPELEAVE: this.f1?.TYPELEAVE?.value,
          RECIPIENT: this.f1?.RECIPIENT?.value ?? '',
        }
        break;
      case PER_SCREEN.OVERTIME:
        url = '/API/Mobile/RegisterOT';
        bodyParams = {
          ...this.formGroup2?.value,
          FromDate: this.datepipe.transform(new Date(this.f2?.FromHour?.value), 'yyyy-MM-dd'),
          FromHour: this.datepipe.transform(new Date(this.f2?.FromHour?.value), 'HH:mm'),
          ToHour: this.datepipe.transform(new Date(this.f2?.ToHour?.value), 'HH:mm'),
          IS_QUENCHAMCONG: this.f2?.IS_QUENCHAMCONG?.value ? '-1' : '0'
        }
        break;
      case PER_SCREEN.WLEO:
        url = '/API/Mobile/RegisterWLEO';
        bodyParams = {
          ...this.formGroup3?.value,
          FROMDATE: this.datepipe.transform(new Date(this.f3?.FROMHOUR?.value), 'yyyy-MM-dd'),
          TODATE: this.datepipe.transform(new Date(this.f3?.TOHOUR?.value), 'yyyy-MM-dd'),
          FROMHOUR: this.datepipe.transform(new Date(this.f3?.FROMHOUR?.value), 'HH:mm'),
          TOHOUR: this.datepipe.transform(new Date(this.f3?.TOHOUR?.value), 'HH:mm'),
        }
        delete bodyParams.ReTime;
        break;
    }

    // POST register
    this.api.post(url, bodyParams, HEADER_ACCEPT).subscribe(res => {
      // Check response
      if (res && res?.ResponseStatus === 1) {
        if (isRegiterAndApprove) {
          // POST Aprrove
          this.onRequestApprove(res); // BOTH REQUEST AND APPROVE
        } else {
          // DONE register
          swal({
            icon: 'success',
            title: 'Đăng ký thành công!',
            buttons: {
              ok: this.translate.instant('COMMON.btn.close'),
            },
          } as any).then(() => {
            // Load list
            this.registerRest.searchParams$.next(this.registerRest.searchParams$.value);
          });
        }
      } else {
        this.api.errorMessage(res?.Message);
      }
    }, err => this.api.errorMessage(err));
  }

  /**
   * Gửi duyệt
   * @param events 
   * @returns 
   */
  public onRequestApprove(res: any) {
    // Status 0: Đăng ký
    let url = null, bodyParams = null;
    switch (this.params?.screen) {
      case PER_SCREEN.HOLIDAY:
        url = '/API/Mobile/SendApproveLeave';
        bodyParams = {
          RegisterID: res?.Items?.length && res?.Items[0],
          Process: "LEAVE"
        }
        break;
      case PER_SCREEN.OVERTIME:
        url = '/API/Mobile/SendApprove';
        bodyParams = {
          RegisterID: res?.Items?.length && res?.Items[0],
          Process: "OVERTIME"
        }
        break;
      case PER_SCREEN.WLEO:
        url = '/API/Mobile/SendApprove';
        bodyParams = {
          RegisterID: res?.Items?.length && res?.Items[0],
          Process: "WLEO"
        }
        break;
    }
    // POST approve
    this.api.post(url, bodyParams, HEADER_ACCEPT).subscribe(res => {
      if (res && res?.ResponseStatus === 1) {
        swal({
          icon: 'success',
          title: 'Đăng ký và gửi duyệt thành công!',
          buttons: {
            ok: this.translate.instant('COMMON.btn.close'),
          },
        } as any).then(() => {
          // Load list
          this.registerRest.searchParams$.next(this.registerRest.searchParams$.value);
        });
      } else {
        this.api.errorMessage(res?.Message);
      }
    }, err => this.api.errorMessage(err));
  }
}
