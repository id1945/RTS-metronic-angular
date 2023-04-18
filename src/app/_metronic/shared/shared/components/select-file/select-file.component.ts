import { FilesService, SelectedFiles } from 'src/app/_metronic/shared/shared/services/files.service';
import { Component, Input, OnInit, Output, EventEmitter, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { Options } from '../../models/options';
import { ApiService } from '../../../http/api.service';

type AcceptKey = 'all' | 'excel' | 'excel_word' | 'excel_word_pdf' | 'excel_word_pdf_rar_zip' | 'excel_word_pdf_rar_zip_jpg_jpeg_png_gif_svg' | 'image';

@Component({
  selector: 'app-select-file',
  templateUrl: './select-file.component.html',
  styleUrls: ['./select-file.component.scss'],
  exportAs: 'select-file'
})
export class SelectFileComponent implements OnInit {
  @ViewChild('file') file: ElementRef;

  @Input() text: string = 'Tải tài liệu lên';
  @Input() reset: boolean = true; // Làm mới danh sách mỗi khi chọn file
  @Input() show: boolean = true; // Show danh sách được lựa chọn
  @Input() disabled: boolean = false;
  @Input() multiple: boolean = true;
  @Input() base64Content: boolean = false;
  @Input() attachKey: any;
  @Input() acceptKey: AcceptKey = 'all';
  @Input() btnClassName = 'btn-light';
  // Twoway binding customize
  @Input() detailReadOnly: SelectedFiles[] = [];
  @Input() selectedFiles: SelectedFiles[] = [];
  @Output() selectedFilesChange = new EventEmitter<SelectedFiles[]>();
  // Choose file
  @Input() unChoose = false; // True: Không chọn file nữa và trả về output (unChooseChange)="$event".
  @Output() unChooseChange = new EventEmitter<boolean>();

  public acceptsActive: Options;
  public accepts: Options[] = [
    {
      value: 'image',
      label: '.png, .jpg, .jpeg, .gif'
    },
    {
      value: 'excel',
      label: '.xls, .xlsx, .xlsm'
    },
    {
      value: 'excel_word',
      label: '.xls, .xlsx, .xlsm, .doc, .docx'
    },
    {
      value: 'excel_word_pdf',
      label: '.xls, .xlsx, .xlsm, .doc, .docx, .pdf'
    },
    {
      value: 'excel_word_pdf_rar_zip',
      label: '.xls, .xlsx, .xlsm, .doc, .docx, .pdf, .rar, .zip'
    },
    {
      value: 'excel_word_pdf_rar_zip_jpg_jpeg_png_gif_svg',
      label: '.xls, .xlsx, .xlsm, .doc, .docx, .pdf, .rar, .zip, .jpg, .jpeg, .png, .gif, .svg'
    }
  ];

  constructor(
    private api: ApiService,
    private cdf: ChangeDetectorRef,
    private filesService: FilesService
  ) { }

  ngOnInit(): void {
    this.acceptsActive = this.accepts.find(f => f.value === (this.acceptKey));
  }

  /**
   * OnChange
   * @param files 
   */
  public onSelectFile(files: File[]) {
    // this.selectedFiles = []; // Clear in the first time
    let funCheck: string;
    switch (this.acceptKey) {
      case 'image':
        funCheck = 'isValidImage';
        break;
      case 'excel':
        funCheck = 'isValidExcel';
        break;
      case 'excel_word':
        funCheck = 'isValidExcelWord';
        break;
      case 'excel_word_pdf':
        funCheck = 'isValidExcelWordPdf';
        break;
      case 'excel_word_pdf_rar_zip':
        funCheck = 'isValidExcelWordPdfRarZip';
        break;
      case 'excel_word_pdf_rar_zip_jpg_jpeg_png_gif_svg':
        funCheck = 'isValidExcelWordPdfRarZipJpgJpegPngGifSvg';
        break;
      default:
        funCheck = 'isValidAll';
        break;
    }
    // Reset select 
    if (this.reset) {
      this.selectedFiles = [];
    }
    // Validate size and type
    if (this.filesService[funCheck](files)) {
      this.api.loadingCustomOn();
      // Convert
      if (this.acceptKey === 'image') {
        this.filesService.toFilesBase64(files, this.selectedFiles, this.attachKey, this.base64Content).subscribe((res: SelectedFiles[]) => {
          this.selectedFiles = res;
          this.selectedFilesChange.emit(this.selectedFiles);
          this.cdf.detectChanges();
          this.api.loadingCustomOff();
        });
      } else if (this.base64Content) {
        this.filesService.toFilesBase64(files, this.selectedFiles, this.attachKey, this.base64Content).subscribe((res: SelectedFiles[]) => {
          this.selectedFiles = res;
          this.selectedFilesChange.emit(this.selectedFiles);
          this.cdf.detectChanges();
          this.api.loadingCustomOff();
        });
      } else {
        this.selectedFiles = this.filesService.toFiles(files, this.selectedFiles);
        this.selectedFilesChange.emit(this.selectedFiles);
        this.cdf.detectChanges();
        this.api.loadingCustomOff();
      }
    }
  }

  /**
   * Remove file
   * @param index 
   */
  public removeFile(index) {
    this.selectedFiles = this.selectedFiles.filter((f, i) => i != index);
    this.selectedFilesChange.emit(this.selectedFiles);
  }

  /**
   * Remove all
   */
  public removeAll() {
    this.selectedFilesChange.emit([]);
  }

  public download(base64, name) {
    base64 && this.api.downloadURI(base64, name);
  }

  public onSubmit() {
    this.unChoose ? this.unChooseChange.emit() : this.file.nativeElement.click();
  }
}
