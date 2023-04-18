import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import { Options } from 'src/app/_metronic/shared/shared/models/options';
import { SelectedFiles } from 'src/app/_metronic/shared/shared/services/files.service';
import swal from 'sweetalert';
import { VanBanDinhChe } from '../../models/van-ban-dinh-che.model';


@Component({
  selector: 'app-regime-propose-form-modal',
  templateUrl: './regime-propose-form-modal.component.html',
  styleUrls: ['./regime-propose-form-modal.component.scss']
})
export class RegimeProposeFormModalComponent implements OnInit {
  @Output() loadList = new EventEmitter;

  public formGroup: FormGroup;
  public isVisible: boolean;
  public isSubmit: boolean;

  public phamViApDung: any[] = [];
  public quyenTruyCap: any[] = [];
  public vanBanThayTheOptions: Options[] = [];
  public loaiVanBanOptions: Options[] = [];

  public dinhKems: SelectedFiles[] = [];
  public taiLieuBoSungs: SelectedFiles[] = [];
  public dataDetail: VanBanDinhChe;
  public vanBanDinhCheId: number;

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
  async showModal(item: VanBanDinhChe = null) {
    this.vanBanDinhCheId = item?.vanBanDinhCheId;
    this.initForm();
    this.getPhamViApDung();
    this.getvanBanThayTheOptions();
    this.getloaiVanBanOptions();
    if (item) {
      // Get detail by id
      this.dataDetail = await this.getDetail();
      // Patch value
      if (this.dataDetail) {
        this.formGroup.patchValue({
          LoaiVanBanKey: this.dataDetail.loaiVanBanKey,
          VanBanThayTheKey: this.dataDetail.VanBanDinhCheOldId,
          TenVanBan: this.dataDetail.tenVanBan,
          QuyenTruyCaps: this.dataDetail?.quyenTruyCaps?.map((m: any) => m?.phongBanKey),
          PhamViApDungs: this.dataDetail.phamViApDungs?.map((m: any) => m?.phongBanKey),
          NgayHieuLuc: new Date(this.dataDetail.ngayHieuLuc * 1000),
          NgayHetHieuLuc: new Date(this.dataDetail.ngayHetHieuLuc * 1000),
        })
        this.isVisible = true;
      }
    } else {
      this.isVisible = true;
    }
  }

  /**
   * Validate
   */
  private initForm() {
    this.isSubmit = false;
    this.dataDetail = null;
    this.dinhKems = [];
    this.taiLieuBoSungs = [];
    this.formGroup = new FormGroup({
      LoaiVanBanKey: new FormControl('', Validators.required),
      TenVanBan: new FormControl('', Validators.required),
      QuyenTruyCaps: new FormControl(),
      PhamViApDungs: new FormControl(),
      NgayHieuLuc: new FormControl(),
      NgayHetHieuLuc: new FormControl(),
      VanBanThayTheKey: new FormControl(),
      IsCoHieuLuc: new FormControl(true),
      IsAllowDownload: new FormControl(true),
    })
  }

  get f() { return this.formGroup.controls; }

  /**
   * Get data by id
   * Promise
   */
  public getDetail() {
    return this.api.get('/api/vanban-dinhche-detail', { vanBanDinhCheId: this.vanBanDinhCheId }).toPromise();
  }

  /**
   * Get data select box
   */
  public getPhamViApDung() {
    this.api.get('/api/vanban-dinhche-danhmuc/phong-ban')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.phongBanKey, label: m.phongBanDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.phamViApDung = res;
          this.quyenTruyCap = res;
        }
      })
  }

  /**
   * Submit+
   * Create
   */
  public onCreate() {

    this.isSubmit = true;
    if (this.formGroup.valid) {
      const formData = new FormData();
      // Map form
      Object.keys(this.formGroup.value).forEach(key => {
        switch (key) {
          case 'NgayHieuLuc':
          case 'NgayHetHieuLuc':
            formData.append(key, (~~(new Date(this.f[key].value).getTime() / 1000)).toString());
            break;
          case 'QuyenTruyCaps':
            this.f?.QuyenTruyCaps?.value?.forEach(value => {
              formData.append('QuyenTruyCaps', value);
            });
            break;
          case 'PhamViApDungs':
            this.f?.PhamViApDungs?.value?.forEach(value => {
              formData.append('PhamViApDungs', value);
            });
            break;
          case 'VanBanThayTheKey':
            formData.append('VanBanDinhCheOldId', this.formGroup.value[key]);
            break;
          default:
            formData.append(key, this.formGroup.value[key]);
            break;
        }
      })
      // Map file
      this.dinhKems.forEach(f => {
        formData.append('DinhKems', f.file);
      });
      this.taiLieuBoSungs.forEach(f => {
        formData.append('TaiLieuBoSungs', f.file);
      });
      // Call api
      this.api.post('/api/hoso-vanbandinhche-create', formData).subscribe(
        res => {
          if (res) {
            swal({
              icon: "success",
              title: 'Tạo mới thành công!',
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
    this.isSubmit = true;
    if (this.formGroup.valid) {
      const formData = new FormData();
      // Map form
      Object.keys(this.formGroup.value).forEach(key => {
        switch (key) {
          case 'NgayHieuLuc':
          case 'NgayHetHieuLuc':
            formData.append(key, (~~(new Date(this.f[key].value).getTime() / 1000)).toString());
            break;
          case 'QuyenTruyCaps':
            this.f?.QuyenTruyCaps?.value?.forEach(value => {
              formData.append('QuyenTruyCaps', value);
            });
            break;
          case 'PhamViApDungs':
            this.f?.PhamViApDungs?.value?.forEach(value => {
              formData.append('PhamViApDungs', value);
            });
            break;
          default:
            formData.append(key, this.formGroup.value[key]);
            break;
        }
      })
      // Remove
      formData.delete('IsCoHieuLuc');
      formData.delete('IsAllowDownload');
      // Map file
      this.dinhKems.forEach(f => {
        formData.append('DinhKems', f.file);
      });
      this.taiLieuBoSungs.forEach(f => {
        formData.append('TaiLieuBoSungs', f.file);
      });
      // Call api
      this.api.put(`/api/vanban-dinhche-update/${this.vanBanDinhCheId}`, formData).subscribe(
        res => {
          if (res) {
            swal({
              icon: "success",
              title: 'Cập nhật thành công!',
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

  public getvanBanThayTheOptions() {
    this.api.get('/api/hoso-vanbandinhche-dm/van-ban-thay-the')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.vanBanThayTheKey, label: m.vanBanThayTheDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.vanBanThayTheOptions = res;
        }
      })
  }

  public getloaiVanBanOptions() {
    this.api.get('/api/hoso-vanbandinhche-dm/loai-van-ban')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.loaiVanBanKey, label: m.loaiVanBanDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.loaiVanBanOptions = res;
        }
      })
  }

  /**
   * Detect change
   * @param index 
   * @returns 
   */
  public trackByFn(index: number) {
    return index;
  }
}
