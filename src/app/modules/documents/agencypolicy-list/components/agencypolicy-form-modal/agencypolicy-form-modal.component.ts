import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import serialize from '@octetstream/object-to-form-data';
import swal from 'sweetalert';
import { Options } from 'src/app/_metronic/shared/shared/models/options';
import { SelectedFiles } from 'src/app/_metronic/shared/shared/services/files.service';
import { ChinhSachDaiLyDetailEdit } from '../../models/chinh-sach-dai-ly.model';


@Component({
  selector: 'app-agencypolicy-form-modal',
  templateUrl: './agencypolicy-form-modal.component.html',
  styleUrls: ['./agencypolicy-form-modal.component.scss'],
  exportAs: 'agencypolicy-form'
})
export class AgencyPolicyFormModalComponent {
  @Output() loadList = new EventEmitter;

  public formGroup: FormGroup;
  public isVisible: boolean;

  public boPhanXemOptions: Options[] = [];
  public vungMienXemOptions: Options[] = [];
  public tinhThanhXemOptions: Options[] = [];
  public daiLyXemOptions: Options[] = [];
  public trangThaiOptions: Options[] = [];
  public selectedFiles: SelectedFiles[] = [];
  public detailReadOnlyFiles: SelectedFiles[] = [];
  public dataDetail: ChinhSachDaiLyDetailEdit;
  public chinhSachDaiLyId: number;

  constructor(
    private api: ApiService,
    private translate: TranslateService,
  ) {
    this.initForm();
  }

  /**
   * Show modal
   */
  async showModal(item = null) {
    this.chinhSachDaiLyId = item?.chinhSachDaiLyId;
    this.initForm();
    this.getBoPhan();
    this.getVungMien();
    this.getBoPhanBanHanh();
    this.getTrangThai();
    if (item) {
      // Get detail by id
      this.dataDetail = await this.getDetail();
      // Patch value
      if (this.dataDetail) {
        this.formGroup.patchValue({
          TenChinhSach: this.dataDetail.tenChinhSach ?? '',
          MaChinhSach: this.dataDetail.maChinhSach ?? '',
          TenBoPhanBanHanh: this.dataDetail.tenBoPhanBanHanh ?? '',
          BoPhanXemKeys: this.dataDetail?.boPhanXems?.map(m => m?.boPhanXemKey),
          VungMienXemKeys: this.dataDetail?.vungMienXems?.map(m => m?.vungMienXemKey),
          TinhThanhXemKeys: this.dataDetail?.tinhThanhXems?.map(m => m?.tinhThanhXemKey),
          DaiLyXemKeys: this.dataDetail?.daiLyXems?.map(m => m?.daiLyXemKey),
          TrangThaiKey: this.dataDetail?.trangThaiKey ?? null,
          NgayBanHanh: new Date(this.dataDetail.ngayBanHanh * 1000),
          NgayHetHieuLuc: new Date(this.dataDetail.ngayHetHieuLuc * 1000),
          IsAllowDownload: this.dataDetail?.isAllowDownload ?? true
        })
        this.isVisible = true;
        this.detailReadOnlyFiles = this.dataDetail?.dinhKems?.map(m => ({ name: m?.tenFile, url: m?.urlDownload })) ?? [];
      }
    } else {
      this.isVisible = true;
    }
  }

  /**
   * Validate
   */
  private initForm() {
    this.dataDetail = null;
    this.selectedFiles = [];
    this.formGroup = new FormGroup({
      TenChinhSach: new FormControl('', Validators.required),
      MaChinhSach: new FormControl('', Validators.required),
      TenBoPhanBanHanh: new FormControl(''),
      BoPhanXemKeys: new FormControl(),
      VungMienXemKeys: new FormControl(),
      TinhThanhXemKeys: new FormControl(),
      DaiLyXemKeys: new FormControl(),
      NgayBanHanh: new FormControl(),
      NgayHetHieuLuc: new FormControl(),
      TrangThaiKey: new FormControl(),
      IsAllowDownload: new FormControl(true),
    });
    this.f.VungMienXemKeys.valueChanges.subscribe(key => this.getTinhThanh(key));
    this.f.TinhThanhXemKeys.valueChanges.subscribe(key => this.getDaiLy(key));
  }

  get f() { return this.formGroup.controls; }

  public getDetail() {
    return this.api.get('/api/chinhsach-daily-update', { chinhSachDaiLyId: this.chinhSachDaiLyId }).toPromise();
  }

  public getBoPhanBanHanh() {
    this.api.get('/api/chinhsach-daily-create').subscribe((res: any) => {
      if (res) {
        this.formGroup.patchValue({ TenBoPhanBanHanh: res?.boPhanBanHanhDisplay })
      }
    })
  }

  public getBoPhan() {
    this.api.get('/api/chinhsach-daily-dm/bo-phan-xem')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.boPhanXemKey, label: m.boPhanXemDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.boPhanXemOptions = res;
        }
      })
  }

  public getVungMien() {
    this.api.get('/api/chinhsach-daily-dm/vung-mien-xem')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.vungMienXemKey, label: m.vungMienXemDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.vungMienXemOptions = res;
        }
      })
  }

  public getTinhThanh(VungMienXemKeys: string) {
    this.api.get('/api/chinhsach-daily-dm/tinh-thanh-xem', { VungMienXemKeys: VungMienXemKeys })
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.tinhThanhXemKey, label: m.tinhThanhXemDisplay, meta: m?.vungMienXemKey })))))
      .subscribe((res: any) => {
        if (res) {
          this.tinhThanhXemOptions = res;
        }
      })
  }

  public getDaiLy(TinhThanhXemKeys: string) {
    this.api.get('/api/chinhsach-daily-dm/dai-ly-xem', { TinhThanhXemKeys: TinhThanhXemKeys })
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.daiLyXemKey, label: m.daiLyXemDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.daiLyXemOptions = res;
        }
      })
  }

  public getTrangThai() {
    this.api.get('/api/chinhsach-daily-dm/trang-thai')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.trangThaiKey, label: m.trangThaiDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.trangThaiOptions = res;
        }
      })
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
        NgayBanHanh: ~~(new Date(this.f.NgayBanHanh.value).getTime() / 1000),
        NgayHetHieuLuc: ~~(new Date(this.f.NgayHetHieuLuc.value).getTime() / 1000)
      });
      // Map file
      this.selectedFiles.forEach(f => {
        formData.append('DinhKems', f.file);
      });
      // Call api
      this.api.post('/api/chinhsach-daily-create', formData).subscribe(res => {
        if (res?.isSuccess) {
          swal({
            icon: "success",
            title: 'Thêm mới chính sách đại lý thành công!',
            buttons: {
              ok: this.translate.instant('COMMON.btn.close'),
            },
          } as any).then(() => {
            this.isVisible = false;
            this.loadList.emit();
          });
        } else {
          this.api.errorMessage('Thêm mới chính sách đại lý không thành công!');
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
        ChinhSachDaiLyId: this.chinhSachDaiLyId,
        NgayBanHanh: ~~(new Date(this.f.NgayBanHanh.value).getTime() / 1000),
        NgayHetHieuLuc: ~~(new Date(this.f.NgayHetHieuLuc.value).getTime() / 1000)
      });
      // Map file
      this.selectedFiles.forEach(f => {
        formData.append('DinhKems', f.file);
      });
      // Call api
      this.api.post(`/api/chinhsach-daily-update`, formData).subscribe(res => {
        if (res?.isSuccess) {
          swal({
            icon: "success",
            title: 'Cập nhật chính sách đại lý thành công!',
            buttons: {
              ok: this.translate.instant('COMMON.btn.close'),
            },
          } as any).then(() => {
            this.isVisible = false;
            this.loadList.emit();
          });
        } else {
          this.api.errorMessage('Cập nhật chính sách đại lý không thành công!');
        }
      }, err => this.api.errorMessage(err));
    }
  }
}
