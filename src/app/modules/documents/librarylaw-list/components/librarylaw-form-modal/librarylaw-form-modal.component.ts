import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import serialize from '@octetstream/object-to-form-data';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import { Options } from 'src/app/_metronic/shared/shared/models/options';
import { SelectedFiles } from 'src/app/_metronic/shared/shared/services/files.service';
import swal from 'sweetalert';
import { VienPhapLuatDetailEdit, VienPhapLuatList } from '../../models/vien-phap-luat.model';


@Component({
  selector: 'app-librarylaw-form-modal',
  templateUrl: './librarylaw-form-modal.component.html',
  styleUrls: ['./librarylaw-form-modal.component.scss'],
  exportAs: 'librarylaw-form'
})
export class LibraryLawFormModalComponent {
  @Output() loadList = new EventEmitter;

  public formGroup: FormGroup;
  public isVisible: boolean;

  public nhomPhapLuatOptions: Options[] = [];
  public phamViApDungOptions: Options[] = [];
  public selectedFilesVi: SelectedFiles[] = [];
  public selectedFilesEn: SelectedFiles[] = [];
  public detailReadOnlyVi: any[] = [];
  public detailReadOnlyEn: any[] = [];
  public dataDetail: VienPhapLuatDetailEdit;
  public thuVienPhapLuatId: number;

  constructor(
    private api: ApiService,
    private translate: TranslateService,
  ) {
    this.initForm();
  }

  /**
   * Show modal
   */
  async showModal(item: VienPhapLuatList = null) {
    this.thuVienPhapLuatId = item?.thuVienPhapLuatId;
    this.initForm();
    this.getPhamViApDung();
    this.getNhomPhapLuat();
    if (item) {
      // Get detail by id
      this.dataDetail = await this.getDetail();
      // Patch value
      if (this.dataDetail) {
        this.formGroup.patchValue({
          MaVanBan: this.dataDetail?.maVanBan ?? '',
          TenVanBan: this.dataDetail?.tenVanBan ?? '',
          ChuTheBanHanh: this.dataDetail?.chuTheBanHanh ?? '',
          NgayHieuLuc: new Date(this.dataDetail?.ngayHieuLuc * 1000),
          NgayHetHieuLuc: new Date(this.dataDetail?.ngayHetHieuLuc * 1000),
          NhomPhapLuatKey: this.dataDetail?.nhomPhapLuatKey ?? null,
          PhamViApDungKeys: this.dataDetail?.phamViApDungKeys?.map(key => key),
          Link: this.dataDetail?.link ?? ''
        })
        this.isVisible = true;
        this.detailReadOnlyVi = this.dataDetail?.dinhKemTiengViet?.items?.map(m => ({ name: m?.fileName, attachKey: m?.taiLieuId }));
        this.detailReadOnlyEn = this.dataDetail?.dinhKemTiengAnh?.items?.map(m => ({ name: m?.fileName, attachKey: m?.taiLieuId }));
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
    this.selectedFilesVi = [];
    this.selectedFilesEn = [];
    this.detailReadOnlyVi = [];
    this.detailReadOnlyEn = [];
    this.formGroup = new FormGroup({
      MaVanBan: new FormControl('', Validators.required),
      TenVanBan: new FormControl('', Validators.required),
      ChuTheBanHanh: new FormControl(),
      NgayHieuLuc: new FormControl(),
      NgayHetHieuLuc: new FormControl(),
      NhomPhapLuatKey: new FormControl(null, Validators.required),
      PhamViApDungKeys: new FormControl(),
      Link: new FormControl(),
    })
  }

  get f() { return this.formGroup.controls; }

  /**
   * Get data by id
   * Promise
   */
  public getDetail() {
    return this.api.get('/api/thuvienphapluat-update', { thuVienPhapLuatId: this.thuVienPhapLuatId }).toPromise();
  }

  /**
   * Get data select box
   */
  public getPhamViApDung() {
    this.api.get('/api/thuvienphapluat-dm/phamvi-apdung')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.phamViApDungKey, label: m.phamViApDungDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.phamViApDungOptions = res;
        }
      })
  }

  public getNhomPhapLuat() {
    this.api.get('/api/thuvienphapluat-dm/nhom-phap-luat')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.nhomPhapLuatKey, label: m.nhomPhapLuatDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.nhomPhapLuatOptions = res;
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
        NgayHieuLuc: ~~(new Date(this.f.NgayHieuLuc.value).getTime() / 1000),
        NgayHetHieuLuc: ~~(new Date(this.f.NgayHetHieuLuc.value).getTime() / 1000)
      });
      // Map file
      this.selectedFilesVi.forEach(f => {
        formData.append('DinhKemTiengViets', f.file);
      });
      this.selectedFilesEn.forEach(f => {
        formData.append('DinhKemTiengAnhs', f.file);
      });
      // Call api
      this.api.post('/api/thuvienphapluat-create', formData).subscribe(res => {
        if (res?.isSuccess) {
          swal({
            icon: "success",
            title: 'Thêm mới thư viện pháp luật thành công!',
            buttons: {
              ok: this.translate.instant('COMMON.btn.close'),
            },
          } as any).then(() => {
            this.isVisible = false;
            this.loadList.emit();
          });
        } else {
          this.api.errorMessage('Thêm mới thư viện pháp luật không thành công!');
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
        ThuVienPhapLuatId: this.thuVienPhapLuatId,
        NgayHieuLuc: ~~(new Date(this.f.NgayHieuLuc.value).getTime() / 1000),
        NgayHetHieuLuc: ~~(new Date(this.f.NgayHetHieuLuc.value).getTime() / 1000)
      });
      // Map file
      this.selectedFilesVi.forEach(f => {
        formData.append('DinhKemTiengViets', f.file);
      });
      this.selectedFilesEn.forEach(f => {
        formData.append('DinhKemTiengAnhs', f.file);
      });
      // Call api
      this.api.post(`/api/thuvienphapluat-update`, formData).subscribe(res => {
        if (res?.isSuccess) {
          swal({
            icon: "success",
            title: 'Cập nhật thư viện pháp luật thành công!',
            buttons: {
              ok: this.translate.instant('COMMON.btn.close'),
            },
          } as any).then(() => {
            this.isVisible = false;
            this.loadList.emit();
          });
        } else {
          this.api.errorMessage('Cập nhật thư viện pháp luật không thành công!');
        }
      }, err => this.api.errorMessage(err));
    }
  }
}
