import { TranslateService } from '@ngx-translate/core';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Options } from 'selenium-webdriver';
import swal from 'sweetalert';
import { differenceInCalendarDays } from 'date-fns';
import { MeetingScheduleDetails } from '../../models/meeting-schedule-details.model';
import serialize from '@octetstream/object-to-form-data';

@Component({
  selector: 'app-form-work-modal',
  templateUrl: './form-work-modal.component.html',
  styleUrls: ['./form-work-modal.component.scss'],
  exportAs: 'work'
})
export class FormWorkModalComponent implements OnInit {
  @Output() loadList = new EventEmitter();

  public isVisible = false;
  public formGroup: FormGroup;
  public phongBanOptions: Options[] = [];
  public nhanVienOptions: Options[] = [];
  public nhanVienTable: any[] = [];
  public mode: 'create' | 'edit' | 'detail';
  public dataDetail: MeetingScheduleDetails;
  public congViecId: number;
  public disabledDate = (current: Date): boolean => this.mode != 'edit' ? differenceInCalendarDays(current, new Date()) < 0 : false;

  constructor(
    private api: ApiService,
    // private cdf: ChangeDetectorRef,
    private translate: TranslateService,
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm() {
    this.formGroup = new FormGroup({
      tieuDe: new FormControl('', Validators.required),
      tieuDeEng: new FormControl(''),
      thoiGianBatDau: new FormControl(),
      thoiGianKetThuc: new FormControl(),
      phongBanKey: new FormControl(''),
      nhanVienKey: new FormControl(''),
    });

    this.f.phongBanKey.valueChanges.subscribe(value => {
      if (value) {
        this.getNhanVien(value);
      }
    });

    this.f.nhanVienKey.valueChanges.subscribe(value => {
      if (value && this.f.phongBanKey?.value) {
        this.nhanVienTable.push({
          phongBanDisplay: this.getObjOptions('phongBanOptions', this.f.phongBanKey?.value)?.label,
          nhanVienDisplay: this.getObjOptions('nhanVienOptions', value)?.label,
          nhanVienKey: value
        })
      }
    });
  }

  get f() { return this.formGroup.controls; }

  /**
   * Show popup
   */
  public showModal(mode: 'create' | 'edit' | 'detail', data = null) {
    this.mode = mode;
    this.congViecId = data?.congViecId;
    this.isVisible = true;
    this.initForm();
    this.getPhongBan();
    this.loadDataToForm();
  }

  /**
   * Get option by key
   * @param optionName 
   * @param key 
   * @returns 
   */
  public getObjOptions(optionName: string, key: string) {
    return this[optionName].find(f => f.value === key);
  }

  /**
   * Xoa nhan vien
   * @param idx 
   */
  public removeNhanVien(idx) {
    this.nhanVienTable = this.nhanVienTable?.filter((f, i) => i != idx);
  }

  /**
   * Get phong ban
   */
  public getPhongBan() {
    this.api.get('/api/lich-lam-viec-dm/phong-ban')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.phongBanKey, label: m.phongBanDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.phongBanOptions = res;
        }
      })
  }

  /**
   * Get nhan vien
   * @param phongBanKey 
   */
  public getNhanVien(phongBanKey: string) {
    this.api.get('/api/lich-lam-viec-dm/nhan-vien', { phongBanKey: phongBanKey })
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.nhanVienKey, label: m.nhanVienDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.nhanVienOptions = res;
        }
      })
  }

  /**
   * Create
   * @returns 
   */
  public onCreate() {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }
    const params = serialize({
      tieuDe: this.f.tieuDe.value,
      tieuDeEng: this.f.tieuDeEng.value,
      thoiGianBatDau: Math.floor(new Date(this.f.thoiGianBatDau.value).getTime() / 1000),
      thoiGianKetThuc: Math.floor(new Date(this.f.thoiGianKetThuc.value).getTime() / 1000),
      nhanVienKeys: this.nhanVienTable.map(m => m.nhanVienKey)
    });
    this.api.post('/api/lich-lam-viec-create/cong-viec', params).subscribe(res => {
      if (res?.isSuccess) {
        swal({
          icon: 'success',
          title: `Thêm mới công việc thành công!`,
          buttons: {
            ok: this.translate.instant('COMMON.btn.close'),
          },
        } as any).then(() => {
          this.isVisible = false;
          this.loadList.emit();
        });
      } else {
        this.api.errorMessage('Thêm mới công việc không thành công!');
      }
    }, err => this.api.errorMessage(err))
  }

  /**
   * Edit
   * @returns 
   */
  public onEdit() {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }
    const params = {
      congViecId: this.congViecId,
      tieuDe: this.f.tieuDe.value ?? '',
      tieuDeEng: this.f.tieuDeEng.value ?? '',
      thoiGianBatDau: Math.floor(new Date(this.f.thoiGianBatDau.value).getTime() / 1000),
      thoiGianKetThuc: Math.floor(new Date(this.f.thoiGianKetThuc.value).getTime() / 1000),
      nhanVienKeys: this.nhanVienTable.map(m => m.nhanVienKey) ?? []
    };
    this.api.put('/api/lich-lam-viec-update/cong-viec', params).subscribe(res => {
      if (res?.isSuccess) {
        swal({
          icon: 'success',
          title: `Cập nhật công việc thành công!`,
          buttons: {
            ok: this.translate.instant('COMMON.btn.close'),
          },
        } as any).then(() => {
          this.isVisible = false;
          this.loadList.emit();
        });
      } else {
        this.api.errorMessage('Cập nhật công việc không thành công!');
      }
    }, err => this.api.errorMessage(err))
  }

  /**
   * Get detail
   * Binding to form
   * @param data 
   */
  private async loadDataToForm() {
    this.nhanVienTable = [];
    if (this.mode != 'create') {
      // Request GET detail
      this.dataDetail = await this.api.get('/api/lich-lam-viec-update/cong-viec', { CongViecId: this.congViecId }).toPromise();
      if (this.dataDetail) {
        // Binding
        this.formGroup.patchValue({
          tieuDe: this.dataDetail?.tieuDe,
          tieuDeEng: this.dataDetail?.tieuDeEng,
          thoiGianBatDau: this.dataDetail?.thoiGianBatDau * 1000,
          thoiGianKetThuc: this.dataDetail?.thoiGianKetThuc * 1000,
        });
        // Binding
        this.nhanVienTable = this.dataDetail?.nguoiThamDu?.items?.map(m => ({
          phongBanKey: m?.phongBanKey,
          phongBanDisplay: m?.phongBanDisplay,
          nhanVienKey: m?.nhanVienKey,
          nhanVienDisplay: m?.nhanVienDisplay
        }));
      }
    }
  }

  /**
   * Huỷ công việc
   * @param item 
   */
  public onDelete() {
    this.api.post('/api/lich-lam-viec-update/huy-cong-viec', { congViecId: this.dataDetail?.congViecId }).subscribe(res => {
      if (res?.isSuccess) {
        swal({
          icon: 'success',
          title: 'Huỷ công việc thành công!',
          buttons: {
            ok: this.translate.instant('COMMON.btn.close'),
          },
        } as any).then(() => {
          this.isVisible = false;
          this.loadList.emit();
        });
      } else {
        this.api.errorMessage('Huỷ công việc không thành công!');
      }
    }, err => this.api.errorMessage(err));
  }
}
