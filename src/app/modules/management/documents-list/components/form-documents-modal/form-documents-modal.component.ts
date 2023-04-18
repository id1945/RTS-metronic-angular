import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import swal from 'sweetalert';
import serialize from '@octetstream/object-to-form-data';
import { Options } from 'src/app/_metronic/shared/shared/models/options';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import { SelectedFiles } from 'src/app/_metronic/shared/shared/services/files.service';
import { formatterInputNumber, parserInputNumber } from 'src/app/_metronic/shared/shared/common/helper';

@Component({
  selector: 'app-form-documents-modal',
  templateUrl: './form-documents-modal.component.html',
  styleUrls: ['./form-documents-modal.component.scss']
})
export class FormDocumentsModalComponent implements OnInit {
  @Output() loadList = new EventEmitter;

  // format input number
  public formatter = formatterInputNumber;
  public parser = parserInputNumber;

  public formGroup: FormGroup;
  public isVisible: boolean;
  public isHieuLuc: boolean;
  public isSubmit: boolean;

  public selectedFiles: SelectedFiles[] = [];

  public khuVucOptions: Options[] = [];
  public ngonNguOptions: Options[] = [];
  public loaiTaiLieuOptions: Options[] = [];
  public dataDetail: any;
  public dataModal: any;

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
  async showModal(item = null) {
    this.isVisible = true;
    this.dataModal = item;
    this.initForm();
  }

  /**
   * Validate
   */
  private initForm() {
    this.isSubmit = false;
    this.getLoaiTaiLieuOptions();
    this.getNgonNguOptions();
    this.formGroup = new FormGroup({
      maTaiLieu: new FormControl('', Validators.required),
      tenTaiLieu: new FormControl('', Validators.required),
      moTa: new FormControl(),
      isDownload: new FormControl(false),
      ngonNguKey: new FormControl(),
      loaiTaiLieuKey: new FormControl(),
      tag: new FormControl(),
      thuTuSapXep: new FormControl(),
    })
  }

  get f() { return this.formGroup.controls; }

  /**
   * Submit+
   * Create
   */
  public onCreate() {
    this.isSubmit = true;
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {

      const formData = serialize(this.formGroup.value);
      this.selectedFiles.forEach(f => {
        formData.append('DinhKem', f.file);
      });

      // Call api
      this.api.post(`/api/tailieu-create`, formData).subscribe(
        res => {
          if (res) {
            swal({
              icon: "success",
              title: 'Thêm mới tài liệu thành công!',
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
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      const bodyParam = this.formGroup.value;
      // Call api
      this.api.put(`/dangky-chuyephatnhanh-update/${this.dataModal?.hoSoId}`, bodyParam).subscribe(
        res => {
          if (res?.isSuccess) {
            swal({
              icon: "success",
              title: 'Cập nhật chuyển phát nhanh thành công!',
              buttons: {
                ok: this.translate.instant('COMMON.btn.close'),
              },
            } as any).then(() => {
              this.isVisible = false;
              this.loadList.emit();
            });
          } else {
            this.api.errorMessage('Cập nhật chuyển phát nhanh không thành công!');
          }
        }, err => this.api.errorMessage(err));
    }
  }

  public getNgonNguOptions() {
    this.api.get('/api/tailieu-dm/ngon-ngu')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.ngonNguKey, label: m.ngonNguDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.ngonNguOptions = res;
        }
      })
  }

  public getLoaiTaiLieuOptions() {
    this.api.get('/api/tailieu-dm/loai-tai-lieu')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.loaiTaiLieuKey, label: m.loaiTaiLieuDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.loaiTaiLieuOptions = res;
        }
      })
  }
}