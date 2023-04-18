import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import serialize from '@octetstream/object-to-form-data';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import { FilesService, SelectedFiles } from 'src/app/_metronic/shared/shared/services/files.service';
import swal from 'sweetalert';

@Component({
  selector: 'app-form-photo-library-modal',
  templateUrl: './form-photo-library-modal.component.html',
  styleUrls: ['./form-photo-library-modal.component.scss'],
  exportAs: 'photo-library'
})
export class FormPhotoLibraryModalComponent implements OnInit {

  @Output() loadList = new EventEmitter();

  public isVisible = false;
  public formGroup: FormGroup;

  public dataRow: any;
  public dataDetail: any;
  public selectedFiles: SelectedFiles[] = [];
  public selectedMultipleFile: SelectedFiles[] = [];

  constructor(
    private api: ApiService,
    private file: FilesService,
    private cdf: ChangeDetectorRef,
    private translate: TranslateService,
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm() {
    this.formGroup = new FormGroup({
      TenAlbumAnh: new FormControl('', Validators.required),
      MoTa: new FormControl('', Validators.required),
      GhiChu: new FormControl(''),
      AnhDaiDien: new FormControl(''),
    })
  }

  get f() { return this.formGroup.controls; }

  public async showModal(dataRow = null) {
    this.isVisible = true;
    this.dataRow = dataRow;
    this.initForm();
  }

  public onRemoveMultipleFile(idx) {
    this.selectedMultipleFile = this.selectedMultipleFile.filter((f, i) => i != idx);
  }

  public onChangeMultipleFile(file, idx) {
    this.file.toFilesBase64(file, []).subscribe(res => {
      if (res?.length) {
        this.selectedMultipleFile = this.selectedMultipleFile.map((m, i) => ((i === idx && res?.length) ? res[0] : m));
        this.cdf.detectChanges();
      }
    });
  }

  public onCreate(): void {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return
    }

    let formData = serialize({
      ...this.formGroup?.value,
      AnhDaiDien: this.selectedFiles[0]?.file ?? '',
    });

    this.selectedMultipleFile.forEach(f => {
      formData.append('DinhKems', f?.file);
    });

    this.api.post('/api/thuvienanh-create', formData).subscribe(res => {
      if (res) {
        swal({
          icon: 'success',
          title: 'Thêm album ảnh thành công.',
          buttons: {
            ok: this.translate.instant('COMMON.btn.close'),
          },
        } as any).then(() => {
          this.isVisible = false;
          this.loadList.emit();
          this.cdf.detectChanges();
        });
      }
    }, err => {
      this.api.errorMessage(err);
    });
  }
}
