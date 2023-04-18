import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core'
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import { formatterInputNumber, parserInputNumber } from 'src/app/_metronic/shared/shared/common/helper';
import { SelectedFiles } from 'src/app/_metronic/shared/shared/services/files.service';
import swal from 'sweetalert'

interface File {
  name: string;
  file: any
}

@Component({
  selector: 'app-export-parcel-modal',
  templateUrl: './export-parcel-modal.component.html',
  styleUrls: ['./export-parcel-modal.component.scss']
})
export class ExportParcelModalComponent implements OnInit {

  // format input number
  public formatter = formatterInputNumber;
  public parser = parserInputNumber;

  public isVisible = false;
  public formGroup: FormGroup;
  public isSubmit: boolean;
  public selectedFiles: SelectedFiles[] = [];

  constructor(
    private api: ApiService,
    private cdf: ChangeDetectorRef,
    private translate: TranslateService,
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  /**
   * Validate
   */
  private initForm() {
    this.isSubmit = false;
    this.formGroup = new FormGroup({
      SheetIndex: new FormControl(0, Validators.required),
    })
  }

  get f() { return this.formGroup.controls; }

  public showModal(): void {
    this.isVisible = true;
    this.isSubmit = false;
    this.initForm();
  }

  public onSubmit(): void {
    this.isSubmit = true;
    this.formGroup.markAllAsTouched();
    if (this.selectedFiles?.length && this.formGroup.valid) {
      const formData = new FormData();
      formData.append('SheetIndex', this.f.SheetIndex.value);
      formData.append('File', this.selectedFiles[0]?.file);
      this.api.post('/api/buupham-create/import-excel', formData).subscribe(res => {
        if (res) {
          swal({
            icon: "success",
            title: 'Import file thành công!',
            buttons: {
              ok: this.translate.instant('COMMON.btn.close'),
            },
          } as any).then(() => {
            this.isVisible = false;
            this.cdf.detectChanges();
          });
        }
      }, err => this.api.errorMessage(err))
    }
  }
}
