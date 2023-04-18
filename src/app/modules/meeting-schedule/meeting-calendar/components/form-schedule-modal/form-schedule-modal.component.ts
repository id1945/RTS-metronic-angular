import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { Options } from 'selenium-webdriver';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import { TranslateService } from '@ngx-translate/core';
import swal from 'sweetalert';
import serialize from '@octetstream/object-to-form-data';
import { differenceInCalendarDays } from 'date-fns';
import { MeetingScheduleDetails } from '../../models/meeting-schedule-details.model';
import { DisabledTimeFn } from 'ng-zorro-antd/date-picker';
import { SelectedFiles } from 'src/app/_metronic/shared/shared/services/files.service';

@Component({
  selector: 'app-form-schedule-modal',
  templateUrl: './form-schedule-modal.component.html',
  styleUrls: ['./form-schedule-modal.component.scss'],
  exportAs: 'schedule'
})
export class FormScheduleModalComponent implements OnInit {

  @Output() loadList = new EventEmitter();

  public isVisible = false;
  public formGroup: FormGroup;
  public phongBanOptions: Options[] = [];
  public nhanVienOptions: Options[] = [];
  public nhanVienTable: any[] = [];
  public selectedFiles: SelectedFiles[] = [];
  public mode: 'create' | 'edit' | 'detail';
  public dataDetail: MeetingScheduleDetails;
  public tenPhongHop: string;
  // Disable date
  public disabledDate = (current: Date): boolean => this.mode != 'edit' ? differenceInCalendarDays(current, new Date()) < 0 : false;
  // Disable time
  public disabledDateTime: DisabledTimeFn = () => {
    return {
      nzDisabledHours: () => [...this.range(0, 8), ...this.range(18, 24)],
      nzDisabledMinutes: () => [],
      nzDisabledSeconds: () => []
    };
  }
  public range(start: number, end: number): number[] {
    const result: number[] = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  }

  constructor(
    public api: ApiService,
    private cdf: ChangeDetectorRef,
    public translate: TranslateService,
  ) { }


  ngOnInit(): void {
    this.initForm();
  }

  public showModal(mode: 'create' | 'edit' | 'detail', data = null) {
    this.mode = mode;
    this.isVisible = true;
    this.selectedFiles = [];
    this.initForm();
    this.getPhongBan();
    this.loadDataToForm(data);
  }

  public initForm() {
    this.formGroup = new FormGroup({
      TieuDe: new FormControl('', Validators.required),
      TieuDeEng: new FormControl('', Validators.required),
      SoLuong: new FormControl(null, Validators.required),
      ThoiGianBatDau: new FormControl(null, Validators.required),
      ThoiGianKetThuc: new FormControl(null, Validators.required),
      ThanhPhanKhach: new FormControl(''),
      DvTra: new FormControl(false),
      DvCoffee: new FormControl(false),
      DvTeaBreak: new FormControl(false),
      DvHoa: new FormControl(false),
      DvBienTen: new FormControl(false),
      DvBackdrop: new FormControl(false),
      YeuCauKhac: new FormControl(''),
      PhongHopId: new FormControl(''),
      IsCoHieuLuc: new FormControl(true),
      // other
      PhongBanKey: new FormControl(),
      NhanVienKey: new FormControl(),
      // Edit
      DvTrucTuyen: new FormControl(false),
      KhuVucKey: new FormControl(''),
      NoteForLeTan: new FormControl(''),
    });

    this.f.PhongBanKey.valueChanges.subscribe(value => {
      if (value) {
        this.getNhanVien(value);
      }
    });

    this.f.NhanVienKey.valueChanges.subscribe(value => {
      if (value && this.f.PhongBanKey?.value) {
        this.nhanVienTable.push({
          phongBanDisplay: this.getObjOptions('phongBanOptions', this.f.PhongBanKey?.value)?.label,
          nhanVienDisplay: this.getObjOptions('nhanVienOptions', value)?.label,
          nhanVienKey: value
        })
      }
    });
  }

  get f() { return this.formGroup.controls; }

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
   * Xoa nhan vien
   * @param idx 
   */
  public removeNhanVien(idx) {
    this.nhanVienTable = this.nhanVienTable?.filter((f, i) => i != idx);
  }

  /**
   * Update phong hop được chọn
   * @param item 
   */
  public onPhongHop(item = null) {
    this.tenPhongHop = item?.name ?? null
    this.f.PhongHopId.setValue(item?.id ?? '');
  }

  /**
   * Create lịch họp
   * @returns 
   */
  public onCreate() {

    // Validate
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }
    // Validate
    if (!this.f?.PhongHopId?.value) {
      this.api.errorMessage('Phòng họp là bắt buộc');
      return;
    }

    const form = this.formGroup.value;
    delete form.PhongBanKey;
    delete form.NhanVienKey;

    delete form.DvTrucTuyen;
    delete form.KhuVucKey;
    delete form.NoteForLeTan;

    const formData = serialize({
      ...form,
      ThoiGianBatDau: Math.floor(new Date(this.f.ThoiGianBatDau.value).getTime() / 1000),
      ThoiGianKetThuc: Math.floor(new Date(this.f.ThoiGianKetThuc.value).getTime() / 1000),
      NhanVienKeys: this.nhanVienTable?.map(m => m?.nhanVienKey) ?? [],
      DinhKems: this.selectedFiles?.map(m => (m?.file)) ?? []
    });

    this.api.post('/api/lich-lam-viec-create/lich-hop', formData).subscribe(res => {
      if (res?.isSuccess) {
        swal({
          icon: 'success',
          title: `Thêm mới lịch họp thành công!`,
          buttons: {
            ok: this.translate.instant('COMMON.btn.close'),
          },
        } as any).then(() => {
          this.isVisible = false;
          this.loadList.emit();
          this.cdf.detectChanges();
        });
      } else {
        this.api.errorMessage('Thêm mới lịch họp không thành công!');
      }
    }, err => this.api.errorMessage(err))
  }

  /**
   * Edit lịch họp
   * @returns 
   */
  public onEdit() {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    const form = this.formGroup.value;
    delete form.PhongBanKey;
    delete form.NhanVienKey;

    const formData = serialize({
      ...form,
      CongViecId: this.dataDetail.congViecId,
      ThoiGianBatDau: Math.floor(new Date(this.f.ThoiGianBatDau.value).getTime() / 1000),
      ThoiGianKetThuc: Math.floor(new Date(this.f.ThoiGianKetThuc.value).getTime() / 1000),
      DvTrucTuyen: this.tenPhongHop ? false : true,
      KhuVucKey: this.tenPhongHop ? '' : this.f?.KhuVucKey?.value,
      NoteForLeTan: this.tenPhongHop ? '' : this.f?.NoteForLeTan?.value,
      NhanVienKeys: this.nhanVienTable.map(m => m.nhanVienKey) ?? [],
      DinhKems: this.selectedFiles.map(m => (m.file)) ?? []
    });

    this.api.put('/api/lich-lam-viec-update/lich-hop', formData).subscribe(res => {
      if (res) {
        swal({
          icon: 'success',
          title: `Cập nhật lịch họp thành công!`,
          buttons: {
            ok: this.translate.instant('COMMON.btn.close'),
          },
        } as any).then(() => {
          this.isVisible = false;
          this.loadList.emit();
          this.cdf.detectChanges();
        });
      } else {
        this.api.errorMessage('Cập nhật lịch họp không thành công!');
      }
    }, err => this.api.errorMessage(err))
  }

  /**
   * Get detail
   * Binding to form
   * @param data 
   */
  private async loadDataToForm(data) {
    this.nhanVienTable = [];
    this.tenPhongHop = null;
    if (!data) {
      return false;
    }
    this.dataDetail = null;
    switch (this.mode) {
      case 'edit':
        await this.api.get('/api/lich-lam-viec-update/lich-hop', { CongViecId: data?.congViecId }).toPromise().then(res => {
          this.dataDetail = res;
        }).catch(err => this.api.errorMessage(err));
        break;
      default:
        await this.api.get('/api/lich-lam-viec-detail/lich-hop', { CongViecId: data?.congViecId }).toPromise().then(res => {
          this.dataDetail = res;
        }).catch(err => this.api.errorMessage(err));
        break;
    }
    if (this.dataDetail) {
      // Binding
      this.formGroup.patchValue({
        TieuDe: this.dataDetail?.tieuDe ?? '',
        TieuDeEng: this.dataDetail?.tieuDeEng ?? '',
        SoLuong: this.dataDetail?.soLuong ?? 0,
        ThoiGianBatDau: this.dataDetail?.thoiGianBatDau * 1000,
        ThoiGianKetThuc: this.dataDetail?.thoiGianKetThuc * 1000,
        ThanhPhanKhach: this.dataDetail?.thanhPhanKhach ?? '',
        DvTra: this.dataDetail?.dvTra ?? false,
        DvCoffee: this.dataDetail?.dvCoffee ?? false,
        DvTeaBreak: this.dataDetail?.dvTeaBreak ?? false,
        DvHoa: this.dataDetail?.dvHoa ?? false,
        DvBienTen: this.dataDetail?.dvBienTen ?? false,
        DvBackdrop: this.dataDetail?.dvBackdrop ?? false,
        YeuCauKhac: this.dataDetail?.yeuCauKhac ?? '',
        PhongHopId: this.dataDetail?.phongHopId ?? '',
        IsCoHieuLuc: this.dataDetail?.isCoHieuLuc ?? false,
      });
      if (this.mode === 'edit') {
        this.formGroup.patchValue({
          DvTrucTuyen: this.dataDetail?.dvTrucTuyen ?? false,
          KhuVucKey: this.dataDetail?.khuVucKey ?? '',
          NoteForLeTan: this.dataDetail?.noteForLeTan ?? ''
        });
        this.tenPhongHop = this.dataDetail?.tenPhongHop;
      }
      // Binding
      this.nhanVienTable = (this.dataDetail?.nguoiThamDu || this.dataDetail?.nhanVien)?.items?.map(m => ({
        phongBanKey: m?.phongBanKey,
        phongBanDisplay: m?.phongBanDisplay,
        nhanVienKey: m?.nhanVienKey,
        nhanVienDisplay: m?.nhanVienDisplay
      }));
    }
  }

}
