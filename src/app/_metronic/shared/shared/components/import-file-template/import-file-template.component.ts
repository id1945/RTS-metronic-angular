import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core'
import swal from 'sweetalert'
import { formatterInputNumber, parserInputNumber } from 'src/app/_metronic/shared/shared/common/helper';
import { SelectedFiles } from 'src/app/_metronic/shared/shared/services/files.service';
import { ApiService } from '../../../http/api.service';

@Component({
  selector: 'app-import-file-template',
  templateUrl: './import-file-template.component.html',
  styleUrls: ['./import-file-template.component.scss'],
})
export class ImportFileTemplateComponent implements OnInit {

  // format input number
  public formatter = formatterInputNumber;
  public parser = parserInputNumber;

  public isVisible = false;
  public selectedFiles: SelectedFiles[] = [];

  @Input() importApiUrl: string;
  @Input() templateApiUrl: string;
  @Input() isMultiple: boolean = false;

  constructor(
    private api: ApiService,
    private translate: TranslateService,
    private cdf: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
  }

  public showModal(): void {
    this.isVisible = true;
  }

  /**
   * Upload file
   */
  public onImport(): void {
    if (this.selectedFiles?.length) {
      const formData = new FormData();
      this.selectedFiles.forEach(file => {
        formData.append('File', file?.file);
      });
      this.api.post(this.importApiUrl, formData).subscribe(res => {
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

  /**
   * Download template
   */
  public onTemplate() {
    const header = {
      observe: 'response',
      responseType: 'blob' as 'json',
    };
    this.api.get(this.templateApiUrl, null, header).subscribe(res => {
      if (res) {
        this.api.downloadFileFromBlob(res);
      }
    }, err => {
      // Message error
      this.api.errorMessage(err);
    });
  }

}
