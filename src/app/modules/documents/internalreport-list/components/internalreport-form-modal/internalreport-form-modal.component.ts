import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import swal from 'sweetalert';


@Component({
  selector: 'app-internalreport-form-modal',
  templateUrl: './internalreport-form-modal.component.html',
  styleUrls: ['./internalreport-form-modal.component.scss']
})
export class InternalReportFormModalComponent {
  @Output() loadList = new EventEmitter;

  public formGroup: FormGroup;
  public isVisible: boolean;
  public isSubmit: boolean;

  public phamViApDung: any[] = [];
  public nhomPhapLuat: any[] = [];
  public selectedFilesVi: any[] = [];
  public selectedFilesEn: any[] = [];
  public dataDetail: any;
  public vanBanDinhCheId: number;

  constructor(
    private api: ApiService,
    private translate: TranslateService,
  ) { }

  /**
   * Show modal
   */
  async showModal(item = null) {
    this.initForm();
    this.getPhamViApDung();
    if (item) {
      // Get detail by id
      this.dataDetail = await this.getDetail();
      // Patch value
      if (this.dataDetail) {
        this.formGroup.patchValue({
          tieuDe: this.dataDetail.tieuDe,
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
    this.selectedFilesVi = [];
    this.selectedFilesEn = [];
    this.formGroup = new FormGroup({
      tieuDe: new FormControl('', Validators.required),
      PhamViApDungs: new FormControl(),
      NgayHieuLuc: new FormControl(),
      NgayHetHieuLuc: new FormControl(),
      chuTheBanHanh: new FormControl(),
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
      // Map file
      this.selectedFilesVi.forEach(f => {
        formData.append('DinhKems', f.file);
      });
      // Call api
      this.api.post('/api/vanban-dinhche-create', formData).subscribe(
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
        }, err => {
          this.api.errorMessage(err);
        });
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
      this.selectedFilesVi.forEach(f => {
        formData.append('DinhKems', f.file);
      });
      // Call api
      this.api.put(`/vanban-dinhche-update/${this.vanBanDinhCheId}`, formData).subscribe(
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
        }, err => {
          this.api.errorMessage(err);
        });
    }
  }
}
