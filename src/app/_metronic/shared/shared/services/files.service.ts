import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, AsyncSubject } from 'rxjs';
import swal from 'sweetalert'

export interface SelectedFiles {
  name: string;
  file?: any;
  base64?: string;
  base64Content?: string;
  // For update mode
  id?: string;
  url?: string;
  attachKey?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FilesService {

  constructor(private translate: TranslateService) { }

  public toFiles(files: File[], selectedFiles: SelectedFiles[]): SelectedFiles[] {
    Object.keys(files).forEach((file, i) => {
      selectedFiles?.push({ name: files[i]?.name, file: files[i] });
    });
    return selectedFiles;
  }

  /**
   * Blob to base64
   * @param blob 
   * @returns 
   */
  public blobToBase64(blob): Observable<string> {
    const result = new AsyncSubject<string>();
    if (blob) {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onload = (e) => {
        const base64 = reader?.result as string;
        result.next(base64);
        result.complete();
      };
      return result;
    } else {
      result.next(null);
      result.complete();
      return result;
    }
  }

  /**
   * 
   * @param files 
   * @param selectedFiles 
   * @param attachKey Đưa vào key bất kỳ
   * @param isBase64Content Cho phép đưa ra base64 không có loại file
   * @returns 
   */
  public toFilesBase64(files: File[], selectedFiles: SelectedFiles[], attachKey?: string, isBase64Content = false): Observable<SelectedFiles[]> {
    const result = new AsyncSubject<SelectedFiles[]>();
    if (files?.length) {
      Object.keys(files)?.forEach((file, i) => {
        // const url = URL.createObjectURL(files[i]);
        const reader = new FileReader();
        reader.readAsDataURL(files[i]);
        reader.onload = (e) => {
          const base64 = reader?.result as string;
          const base64NoFomat = isBase64Content ? base64?.replace(/data:([\w]+\/[\W\w]+);base64,/g, '') : '';
          selectedFiles = selectedFiles?.filter(f => f?.name != files[i]?.name);
          selectedFiles.push({ name: files[i]?.name, file: files[i], base64: base64, base64Content: base64NoFomat, attachKey: attachKey });
          result.next(selectedFiles);
          if (files?.length === (i + 1)) {
            result.complete();
          }
        };
      });
      return result;
    } else {
      result.next([]);
      result.complete();
      return result;
    }
  }

  public isValidExcelWord(files: File[]): boolean {
    let isValid = true;
    Object.keys(files)?.forEach((file, i) => {
      // const FileSize = files[i].size / 1024 / 1024; // in MB
      const pattern = /\.(xls|xlsx|xlsm|doc|docx)$/i;
      if (!pattern.test(files[i].name)) {
        swal({
          icon: "warning",
          title: this.translate.instant('COMMON.file.type_excel_word'),
          buttons: {
            ok: this.translate.instant('COMMON.btn.close'),
          },
        });
        isValid = false;
        // } else if (FileSize > 20) {
        //   swal({
        //     icon: "warning",
        //     title: this.translate.instant('COMMON.file.size_20'),
        //     buttons: {
        //       ok: this.translate.instant('COMMON.btn.close'),
        //     },
        //   });
        //   isValid = false;
      }
    });
    return isValid;
  }

  public isValidExcelWordPdf(files: File[]): boolean {
    let isValid = true;
    Object.keys(files)?.forEach((file, i) => {
      // const FileSize = files[i].size / 1024 / 1024; // in MB
      const pattern = /\.(xls|xlsx|xlsm|doc|docx|pdf)$/i;
      if (!pattern.test(files[i].name)) {
        swal({
          icon: "warning",
          title: this.translate.instant('COMMON.file.type_excel_word_pdf'),
          buttons: {
            ok: this.translate.instant('COMMON.btn.close'),
          },
        });
        isValid = false;
        // } else if (FileSize > 20) {
        //   swal({
        //     icon: "warning",
        //     title: this.translate.instant('COMMON.file.size_20'),
        //     buttons: {
        //       ok: this.translate.instant('COMMON.btn.close'),
        //     },
        //   });
        //   isValid = false;
      }
    });
    return isValid;
  }

  public isValidExcelWordPdfRarZip(files: File[]): boolean {
    let isValid = true;
    Object.keys(files)?.forEach((file, i) => {
      // const FileSize = files[i].size / 1024 / 1024; // in MB
      const pattern = /\.(xls|xlsx|xlsm|doc|docx|pdf|rar|zip)$/i;
      if (!pattern.test(files[i].name)) {
        swal({
          icon: "warning",
          title: this.translate.instant('COMMON.file.type_excel_word_pdf_rar_zip'),
          buttons: {
            ok: this.translate.instant('COMMON.btn.close'),
          },
        });
        isValid = false;
        // } else if (FileSize > 20) {
        //   swal({
        //     icon: "warning",
        //     title: this.translate.instant('COMMON.file.size_20'),
        //     buttons: {
        //       ok: this.translate.instant('COMMON.btn.close'),
        //     },
        //   });
        //   isValid = false;
      }
    });
    return isValid;
  }

  public isValidExcelWordPdfRarZipJpgJpegPngGifSvg(files: File[]): boolean {
    let isValid = true;
    Object.keys(files)?.forEach((file, i) => {
      // const FileSize = files[i].size / 1024 / 1024; // in MB
      const pattern = /\.(xls|xlsx|xlsm|doc|docx|pdf|rar|zip|jpg|jpeg|png|gif|svg)$/i;
      if (!pattern.test(files[i].name)) {
        swal({
          icon: "warning",
          title: this.translate.instant('COMMON.file.excel_word_pdf_rar_zip_jpg_jpeg_png_gif_svg'),
          buttons: {
            ok: this.translate.instant('COMMON.btn.close'),
          },
        });
        isValid = false;
        // } else if (FileSize > 20) {
        //   swal({
        //     icon: "warning",
        //     title: this.translate.instant('COMMON.file.size_20'),
        //     buttons: {
        //       ok: this.translate.instant('COMMON.btn.close'),
        //     },
        //   });
        //   isValid = false;
      }
    });
    return isValid;
  }

  /**
   * EXCEL
   * @param files 
   * @param selectedFiles 
   * @returns 
   */
  public isValidExcel(files: File[]): boolean {
    let isValid = true;
    Object.keys(files)?.forEach((file, i) => {
      // const FileSize = files[i].size / 1024 / 1024; // in MB
      const pattern = /\.(xls|xlsx|xlsm)$/i;
      if (!pattern.test(files[i].name)) {
        swal({
          icon: "warning",
          title: this.translate.instant('COMMON.file.type_excel'),
          buttons: {
            ok: this.translate.instant('COMMON.btn.close'),
          },
        });
        isValid = false;
        // } else if (FileSize > 20) {
        //   swal({
        //     icon: "warning",
        //     title: this.translate.instant('COMMON.file.size_20'),
        //     buttons: {
        //       ok: this.translate.instant('COMMON.btn.close'),
        //     },
        //   });
        //   isValid = false;
      }
    });
    return isValid;
  }

  /**
   * IMAGES
   * @param files 
   * @param selectedFiles 
   * @returns 
   */
  public isValidImage(files: File[]): boolean {
    let isValid = true;
    Object.keys(files)?.forEach((file, i) => {
      // const FileSize = files[i].size / 1024 / 1024; // in MB
      const pattern = /\.(png|jpg|jpeg|gif)$/i;
      if (!pattern.test(files[i].name)) {
        swal({
          icon: "warning",
          title: this.translate.instant('COMMON.file.type_images'),
          buttons: {
            ok: this.translate.instant('COMMON.btn.close'),
          },
        });
        isValid = false;
        // } else if (FileSize > 20) {
        //   swal({
        //     icon: "warning",
        //     title: this.translate.instant('COMMON.file.size_20'),
        //     buttons: {
        //       ok: this.translate.instant('COMMON.btn.close'),
        //     },
        //   });
        //   isValid = false;
      }
    });
    return isValid;
  }

  /**
   * IMAGES
   * @param files 
   * @param selectedFiles 
   * @returns 
   */
  public isValidAll(files: File[]): boolean {
    let isValid = true;
    // Object.keys(files).forEach((file, i) => {
    //   const FileSize = files[i].size / 1024 / 1024; // in MB
    //   if (FileSize > 20) {
    //     swal({
    //       icon: "warning",
    //       title: this.translate.instant('COMMON.file.size_20'),
    //       buttons: {
    //         ok: this.translate.instant('COMMON.btn.close'),
    //       },
    //     });
    //     isValid = false;
    //   }
    // });
    return isValid;
  }
}
