import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import { SelectedFiles } from 'src/app/_metronic/shared/shared/services/files.service';
import swal from 'sweetalert';


@Component({
  selector: 'app-numberdocs-form-modal',
  templateUrl: './numberdocs-form-modal.component.html',
  styleUrls: ['./numberdocs-form-modal.component.scss']
})
export class NumberdocsFormModalComponent implements OnInit {
  @Output() loadList = new EventEmitter;

  public formGroup: FormGroup;
  public isVisible: boolean;
  public isSubmit: boolean;

  public selectedFiles: SelectedFiles[] = [];

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
  async showModal() {
    this.initForm();
    this.isVisible = true;
  }

  /**
   * Validate
   */
  private initForm() {
    this.isSubmit = false;
    this.selectedFiles = [];
    this.formGroup = new FormGroup({
      TenVanBan: new FormControl('', Validators.required),
      KiHieuVanBan: new FormControl('', Validators.required),
      DonViNhan: new FormControl('', Validators.required),
    })
  }

  get f() { return this.formGroup.controls; }
  /**
   * Submit+
   * Create
   */
  public onCreate() {
    this.isSubmit = true;
    var kyHieu = this.f.KiHieuVanBan.value;
    if (this.formGroup.valid) {

      if (this.selectedFiles?.length === 0) {
        return // reject
      }
      const formData = new FormData();
      // Map form
      Object.keys(this.formGroup.value).forEach(key => {
        switch (key) {
          default:
            formData.append(key, this.formGroup.value[key]);
            break;
        }
      })
      // Map file
      this.selectedFiles.forEach(f => {
        formData.append('DinhKems', f.file);
      });
      // Call api
      this.api.post('/api/lay-so-vanban-create', formData).subscribe(
        res => {
          if (res) {
            swal({
              icon: "success",
              title: 'Tạo mới thành công! Vui lòng chờ phê duyệt để được cấp số.',
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

}
