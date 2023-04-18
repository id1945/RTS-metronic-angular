import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { configTextEditor } from 'src/app/_metronic/shared/shared/common/helper';
import { TranslateService } from '@ngx-translate/core';
import serialize from '@octetstream/object-to-form-data';
import { Options } from 'src/app/_metronic/shared/shared/models/options';
import { switchMap } from 'rxjs/operators';
import swal from 'sweetalert';
import { of } from 'rxjs';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import { SelectedFiles } from 'src/app/_metronic/shared/shared/services/files.service';

interface Detail {
  baiVietId: number;
  nhomBaiVietKey: string;
  tieuDe: string;
  moTa: string;
  isNoiBat: true,
  noiDung: string;
  tieuDeEng: string;
  moTaEng: string;
  noiDungEng: string
}

@Component({
  selector: 'app-form-posts-modal',
  templateUrl: './form-posts-modal.component.html',
  styleUrls: ['./form-posts-modal.component.scss']
})
export class FormPostsModalComponent implements OnInit {

  public isVisible = false;
  public formGroup: FormGroup;
  public config = configTextEditor;
  public nhomBaiVietOptions: Options[] = [];

  public dataRow: any;
  public dataDetail: Detail;
  public selectedFiles: SelectedFiles[] = [];

  @Output() loadList = new EventEmitter();

  constructor(
    private api: ApiService,
    private cdf: ChangeDetectorRef,
    private translate: TranslateService,
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm() {
    this.formGroup = new FormGroup({
      nhomBaiVietKey: new FormControl('', Validators.required),
      tieuDe: new FormControl('', Validators.required),
      tieuDeEng: new FormControl('', Validators.required),
      moTa: new FormControl('', Validators.required),
      moTaEng: new FormControl('', Validators.required),
      isNoiBat: new FormControl(false),
      noiDung: new FormControl('', Validators.required),
      noiDungEng: new FormControl('', Validators.required),
    })
  }

  get f() { return this.formGroup.controls; }

  public async showModal(dataRow = null): Promise<void> {
    this.isVisible = true;
    this.dataRow = dataRow;
    await this.getDetailById();
    await this.getNhomBaiViet();
    this.loadDraft();
  }

  public onEdit(): void {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return
    }

    let params = {
      ...this.formGroup?.value,
      baiVietId: this.dataRow?.baiVietId,
    }

    if (this.selectedFiles && this.selectedFiles.length) {
      params = { ...params, anhDaiDien: this.selectedFiles[0].file };
    }

    let formData = serialize(params);

    this.api.put('/api/baiviet-update', formData).subscribe(res => {
      if (res) {
        swal({
          icon: 'success',
          title: 'Cập nhật bài viết thành công.',
          buttons: {
            ok: this.translate.instant('COMMON.btn.close'),
          },
        } as any).then(() => {
          this.loadList.emit();
          this.removeDraft();
          this.cdf.detectChanges();
        });
      }
    }, err => {
      this.api.errorMessage(err);
    });
  }

  public onCreate(): void {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return
    }

    let params = { ...this.formGroup?.value }

    if (this.selectedFiles && this.selectedFiles.length) {
      params = { ...params, anhDaiDien: this.selectedFiles[0].file };
    }

    let formData = serialize(params);

    this.api.post('/api/baiviet-create', formData).subscribe(res => {
      if (res) {
        swal({
          icon: 'success',
          title: 'Thêm bài viết thành công.',
          buttons: {
            ok: this.translate.instant('COMMON.btn.close'),
          },
        } as any).then(() => {
          this.loadList.emit();
          this.removeDraft();
          this.cdf.detectChanges();
        });
      }
    }, err => {
      this.api.errorMessage(err);
    });
  }

  public async getDetailById() {
    if (this.dataRow?.baiVietId) {
      this.dataDetail = await this.api.get('/api/baiviet-update', { baiVietId: this.dataRow?.baiVietId }).toPromise();
    }
  }

  public async getNhomBaiViet() {
    this.nhomBaiVietOptions = await this.api.get('/api/baiviet-danhmuc/nhom-bai-viet').pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m?.nhomBaiVietKey, label: m?.nhomBaiVietDisplay }))))).toPromise();
  }

  public saveDraft(): void {
    this.isVisible = false;
    this.selectedFiles = [];
    localStorage.setItem('POSTS_DRAFT', JSON.stringify(this.formGroup.value));
  }

  public loadDraft(): void {
    const data = JSON.parse(localStorage.getItem('POSTS_DRAFT'));
    // this.baiVietId
    if (this.dataRow?.baiVietId) {
      this.formGroup.patchValue({
        nhomBaiVietKey: this.dataDetail.nhomBaiVietKey,
        tieuDe: this.dataDetail.tieuDe,
        tieuDeEng: this.dataDetail.tieuDeEng,
        moTa: this.dataDetail.moTa,
        moTaEng: this.dataDetail.moTaEng,
        isNoiBat: this.dataDetail.isNoiBat,
        noiDung: this.dataDetail.noiDung,
        noiDungEng: this.dataDetail.noiDungEng
      });
    } else {
      data && this.formGroup.patchValue(data);
    }
  }

  public removeDraft() {
    this.isVisible = false;
    localStorage.removeItem('POSTS_DRAFT');
  }

}
