import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import swal from 'sweetalert';
import serialize from '@octetstream/object-to-form-data';
import { Options } from 'src/app/_metronic/shared/shared/models/options';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import { SelectedFiles } from 'src/app/_metronic/shared/shared/services/files.service';

@Component({
  selector: 'app-form-users-modal',
  templateUrl: './form-users-modal.component.html',
  styleUrls: ['./form-users-modal.component.scss']
})
export class FormUsersModalComponent implements OnInit {
  @Output() loadList = new EventEmitter;

  public isVisible: boolean;
  public formGroup: FormGroup;
  public nguoiDungId: number;
  // options
  public selectedFiles: SelectedFiles[] = [];
  public chucDanhOptions: Options[] = [];
  public quanLyTrucTiepOptions: Options[] = [];
  public boPhanOptions: Options[] = [];
  public nguoiDungOptions: Options[] = [];
  public nghiepVuOptions: Options[] = [];
  public nhomChucDanhHMCTPOptions: Options[] = [];

  constructor(
    private api: ApiService,
    private translate: TranslateService,
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  /**
   * Show modal
   */
  async showModal(nguoiDungId = null) {
    this.isVisible = true;
    this.nguoiDungId = nguoiDungId;
    this.initForm();
    this.selectedFiles = [];
    // Load options
    this.getBoPhanOptions();
    this.getChucDanhHMCTPOptions();
    this.getChucDanhOptions();
    this.getNghiepVuOptions();
    this.getNguoiDungOptions();
    this.getQuanLyTrucTiepOptions();
    // Edit
    if (nguoiDungId) {
      this.bindingEdit();
    }
  }

  /**
   * Validate
   */
  private initForm() {
    this.formGroup = new FormGroup({
      tenDangNhap: new FormControl('', Validators.required),
      hoTen: new FormControl('', Validators.required),
      maNhanVien: new FormControl('', Validators.required),
      ngaySinh: new FormControl(),
      ngayBatDauLam: new FormControl(),
      chucDanhKey: new FormControl(),
      nguoiQuanLyTrucTiepKey: new FormControl(),
      emailCongTy: new FormControl(''),
      soMayLe: new FormControl(''),
      phongBanKey: new FormControl(null, Validators.required),
      donViLamViec: new FormControl(''),
      noiLamViec: new FormControl(''),
      isHtc: new FormControl(true),
      nhomNguoiDungKeys: new FormControl(null, Validators.required),
      dienThoai: new FormControl(''),
      soGiayTo: new FormControl(''),
      diaChiCuTru: new FormControl(''),
      queQuan: new FormControl(''),
      ghiChu: new FormControl(''),
      nghiepVuKeys: new FormControl(),
      isCoHieuLuc: new FormControl(true),
      isGioiTinhNam: new FormControl(true),
      nhomChucDanhKey: new FormControl(),
      matKhau: new FormControl(),
      // only EDIT
      anhDaiDienURL: new FormControl(''),
    })
  }

  get f() { return this.formGroup.controls; }

  /**
   * Get Chức danh
   */
  public getChucDanhOptions() {
    this.api.get('/api/nguoidung-dm/chuc-danh')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.chucDanhKey, label: m.chucDanhDisplay })))))
      .subscribe(res => {
        if (res) {
          this.chucDanhOptions = res;
        }
      }, err => this.api.errorMessage(err));
  }

  /**
   * Get Người quản lý trực tiếp
   */
  public getQuanLyTrucTiepOptions() {
    this.api.get('/api/nguoidung-dm/quan-ly-truc-tiep')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.nguoiQuanLyTrucTiepKey, label: m.nguoiQuanLyTrucTiepDisplay })))))
      .subscribe(res => {
        if (res) {
          this.quanLyTrucTiepOptions = res;
        }
      }, err => this.api.errorMessage(err));
  }

  /**
   * Get Bộ phận
   */
  public getBoPhanOptions() {
    this.api.get('/api/nguoidung-dm/phong-ban')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.phongBanKey, label: m.phongBanDisplay })))))
      .subscribe(res => {
        if (res) {
          this.boPhanOptions = res;
        }
      }, err => this.api.errorMessage(err));
  }

  /**
   * Get Nhóm người dùng
   */
  public getNguoiDungOptions() {
    this.api.get('/api/nguoidung-dm/nhom-nguoi-dung')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.nhomNguoiDungKey, label: m.nhomNguoiDungDisplay })))))
      .subscribe(res => {
        if (res) {
          this.nguoiDungOptions = res;
        }
      }, err => this.api.errorMessage(err));
  }

  /**
   * Get Nghiệp vụ
   */
  public getNghiepVuOptions() {
    this.api.get('/api/nguoidung-dm/nghiep-vu')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.nghiepVuKey, label: m.nghiepVuDisplay })))))
      .subscribe(res => {
        if (res) {
          this.nghiepVuOptions = res;
        }
      }, err => this.api.errorMessage(err));
  }

  /**
   * Get Nhóm chức danh tính hạn mức công tác phí
   */
  public getChucDanhHMCTPOptions() {
    this.api.get('/api/nguoidung-dm/nhom-chuc-danh')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.nhomChucDanhKey, label: m.nhomChucDanhDisplay })))))
      .subscribe(res => {
        if (res) {
          this.nhomChucDanhHMCTPOptions = res;
        }
      }, err => this.api.errorMessage(err));
  }

  /**
   * Submit+
   * Create
   */
  public onCreate() {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      const formData = serialize({
        ...this.formGroup.value,
        ngaySinh: Math.floor(new Date(this.f.ngaySinh.value).getTime() / 1000),
        ngayBatDauLam: Math.floor(new Date(this.f.ngayBatDauLam.value).getTime() / 1000),
      });
      formData.delete('anhDaiDienURL');
      this.selectedFiles?.length && formData.append('AnhDaiDien', this.selectedFiles[0].file);
      // Call api
      this.api.post(`/api/nguoidung-create`, formData).subscribe(res => {
        if (res) {
          swal({
            icon: "success",
            title: 'Thêm người dùng thành công!',
            buttons: {
              ok: this.translate.instant('COMMON.btn.close'),
            },
          } as any).then(() => {
            this.isVisible = false;
            this.loadList.emit();
          });
        }
      }, err => this.api.errorMessage(err));
    }
  }

  /**
   * Submit=
   * Update 
   */
  public onEdit() {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      const formData = serialize({
        ...this.formGroup.value,
        nguoiDungId: this.nguoiDungId,
        ngaySinh: Math.floor(new Date(this.f.ngaySinh.value).getTime() / 1000),
        ngayBatDauLam: Math.floor(new Date(this.f.ngayBatDauLam.value).getTime() / 1000),
      });
      this.selectedFiles?.length && formData.append('AnhDaiDien', this.selectedFiles[0].file);
      // Call api
      this.api.post(`/api/nguoidung-update`, formData).subscribe(res => {
        if (res?.isSuccess) {
          swal({
            icon: "success",
            title: 'Cập nhật người dùng thành công!',
            buttons: {
              ok: this.translate.instant('COMMON.btn.close'),
            },
          } as any).then(() => {
            this.isVisible = false;
            this.loadList.emit();
          });
        } else {
          this.api.errorMessage('Cập nhật người dùng không thành công!');
        }
      }, err => this.api.errorMessage(err));
    }
  }

  private bindingEdit() {
    this.api.get('/api/nguoidung-update', { NguoiDungId: this.nguoiDungId }).subscribe(res => {
      if (res) {
        this.formGroup.patchValue({
          tenDangNhap: res?.tenDangNhap ?? '',
          hoTen: res?.hoTen ?? '',
          maNhanVien: res?.maNhanVien ?? '',
          ngaySinh: res?.ngaySinh * 1000,
          ngayBatDauLam: res?.ngayBatDauLam * 1000,
          chucDanhKey: res?.chucDanhKey ?? '',
          nguoiQuanLyTrucTiepKey: res?.nguoiQuanLyTrucTiepKey ?? '',
          emailCongTy: res?.emailCongTy ?? '',
          soMayLe: res?.soMayLe ?? '',
          phongBanKey: res?.phongBanKey ?? '',
          donViLamViec: res?.donViLamViec ?? '',
          noiLamViec: res?.noiLamViec ?? '',
          isHtc: res?.isHtc ?? true,
          nhomNguoiDungKeys: res?.nhomNguoiDung?.items?.map(m => m?.nhomNguoiDungKey) ?? [],
          dienThoai: res?.dienThoai ?? '',
          soGiayTo: res?.soGiayTo ?? '',
          diaChiCuTru: res?.diaChiCuTru ?? '',
          queQuan: res?.queQuan ?? '',
          ghiChu: res?.ghiChu ?? '',
          nghiepVuKeys: res?.nghiepVu?.items?.map(m => m?.nghiepVuKey) ?? [],
          isCoHieuLuc: res?.isCoHieuLuc ?? true,
          isGioiTinhNam: res?.isGioiTinhNam ?? true,
          nhomChucDanhKey: res?.nhomChucDanhKey ?? '',
          // matKhau: res?.matKhau,
          // only EDIT
          anhDaiDienURL: res?.anhDaiDienURL ?? '',
        });
      }
    }, err => this.api.errorMessage(err));
  }
}
