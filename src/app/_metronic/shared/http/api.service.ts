import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';
import swal from 'sweetalert'
import { getTrimmedData, removeEmpty } from '../shared/common/helper';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  public loading: BehaviorSubject<boolean> = new BehaviorSubject(false); // Default value: false
  public loadingCustom: BehaviorSubject<boolean> = new BehaviorSubject(false); // Default value: false

  // ==============
  // LOADING ...
  // ==============

  /**
   * @description On loading
   * @description loadingCustomOn Dùng để thay thế loadingOn
   * @description Chỉ sử dụng loadingCustomOn chỉ khi gặp sự cố với loadingOn không hoạt động theo ý muốn.
   * @return void
   */
  public loadingCustomOn(): void {
    this.loadingCustom.next(true);
  }

  /**
   * @description Off loading
   * @description loadingCustomOff Dùng để thay thế loadingOff
   * @description Chỉ sử dụng loadingCustomOff chỉ khi gặp sự cố với loadingOff không hoạt động theo ý muốn.
   * @return void
   */
  public loadingCustomOff(): void {
    this.loadingCustom.next(false);
  }

  /**
   * @description On loading
   * @description Đã được cài đặt dùng chung.
   * @description Khi call bắt cứ api nào loadingOn đều được chạy
   * @return void
   */
  public loadingOn(): void {
    this.loading.next(true);
  }

  /**
   * @description Off loading
   * @description Đã được cài đặt dùng chung.
   * @description Khi call response bắt cứ api nào loadingOff đều được chạy
   * @return void
   */
  public loadingOff(): void {
    this.loading.next(false);
  }

  /**
   * @description Lifecycle
   * @param httpClient: HttpClient
   * @return void
   */
  constructor(
    private httpClient: HttpClient,
    private translate: TranslateService,
  ) { }

  /**
   * @description GET HTTP
   * @param url: string
   * @return Observable
   */
  public get(url: string, query?: any | any[], option?: any): Observable<any> {
    let urlFinal = url;
    if (query) {
      urlFinal = url + '?' + this.buildQueryParam(query);
    }
    this.loadingOn();
    return this.httpClient.get(urlFinal, option);
  }

  /**
   * @description POST HTTP
   * @param url: string
   * @param body: any
   * @param option?: any
   * @return Observable
   */
  public post(url: string, body: any, option?: any): Observable<any> {
    this.loadingOn();
    return this.httpClient.post(url, getTrimmedData(body), option);
  }

  /**
   * @description PUT HTTP
   * @param url: string
   * @param body: any
   * @return Observable
   */
  public put(url: string, body: any): Observable<any> {
    this.loadingOn();
    return this.httpClient.put(url, getTrimmedData(body));
  }

  /**
   * @description PATH HTTP
   * @param url: string
   * @param body: any
   * @return Observable
   */
  public patch(url: string, body: any): Observable<any> {
    this.loadingOn();
    return this.httpClient.patch(url, body);
  }

  /**
   * @description DELETE HTTP
   * @param url: string
   * @return Observable
   */
  public delete(url: string): Observable<any> {
    this.loadingOn();
    return this.httpClient.delete(url);
  }

  /**
   * HttpParams
   * NOTE: query.set(k, params[k]); // Các key giống nhau sẽ lấy duy nhất một key cuối cùng
   * NOTE: query.append(k, params[k]); // Chấp nhận các key giống nhau
   */
  public buildQueryParam(params: any | any[]) {
    let query = new HttpParams();
    if (params instanceof Array) {
      for (let param of params) {
        for (let k in param) {
          query = query.append(k, param[k]);
        }
      }
    } else if (params instanceof Object) {
      for (let k in removeEmpty(params)) {
        query = query.append(k, params[k]);
      }
    }
    return query.toString();
  }

  /**
   * Download URI
   * Base64
   */
  public downloadURI(uri: string, name?: string) {
    if (!uri) {
      return;
    }

    const download = (uri) => {
      const link = document.createElement('a');
      // If you don't know the name or want to use
      // the webserver default set name = ''
      if (name) {
        link.setAttribute('download', name);
      }
      link.href = uri;
      document.body.appendChild(link);
      link.click();
      link.remove();
    }

    if (uri?.includes('http://') || uri?.includes('https://')) {
      // PDF
      if (new RegExp(/(\.pdf)/g).test(name?.toLocaleLowerCase())) {
        // URL  
        if (uri?.includes('download=true')) {
          // File name .pdf
          // URL ?download=true
          // Remove ?download=true
          window.open(uri?.replace('?download=true', ''), '_blank', 'menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes');
        } else {
          // File khác để nguyên uri
          // blob:http://localhost:4200/581fb717-be89-42a6-93e9-c191bcbbfe7f
          window.open(uri, '_blank', 'menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes');
        }
      } else {
        // !PDF
        // blob:http://localhost:4200/581fb717-be89-42a6-93e9-c191bcbbfe7f
        download(uri);
      }
    } else if (new RegExp(/(base64)/g).test(uri)) {
      // File base64
      this.loadingCustomOn(); // ON
      fetch(uri).then(res => res.blob()).then((res) => {
        const uri_from_blob = this.convertBlobToUrl({ body: res }, name);
        if (new RegExp(/(\.pdf)/g).test(name?.toLocaleLowerCase())) {
          // File name .pdf
          window.open(uri_from_blob, '_blank', 'menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes');
        } else {
          // File khác download
          download(uri_from_blob);
        }
        this.loadingCustomOff(); // OFF
      }).catch(() => this.loadingCustomOff());
    } else {
      download(uri);
    }
  }

  /**
   * Download blob to url
   */
  public convertBlobToUrl(res: any, fileName?: string): string {
    /* Get blob */
    let type = '';
    if (new RegExp(/(\.pdf)/g).test(fileName?.toLocaleLowerCase())) {
      type = 'application/pdf';
    }
    if (new RegExp(/(\.docx)/g).test(fileName?.toLocaleLowerCase())) {
      type = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    }
    if (new RegExp(/(\.doc)/g).test(fileName?.toLocaleLowerCase())) {
      type = 'application/msword';
    }
    if (new RegExp(/(\.xlsx)/g).test(fileName?.toLocaleLowerCase())) {
      type = 'application/vndgetDetail.openxmlformats-officedocument.spreadsheetml.sheet';
    }
    if (new RegExp(/(\.xls)/g).test(fileName?.toLocaleLowerCase())) {
      type = 'application/vnd.ms-excel';
    }
    if (new RegExp(/(\.(gif|jpe?g|tiff?|png|webp|bmp))/g).test(fileName?.toLocaleLowerCase())) {
      type = `image/${fileName?.split('.')?.slice(-1)?.join()}`;
    }
    if (new RegExp(/(\.(rar))/g).test(fileName?.toLocaleLowerCase())) {
      type = `application/octet-stream`;
    }
    if (new RegExp(/(\.(zip))/g).test(fileName?.toLocaleLowerCase())) {
      type = `application/x-zip-compressed`;
    }
    const blob = new Blob([res.body], { type: type });
    return window.URL.createObjectURL(blob);
  }

  public downloadFileFromBlob(res) {
    const fileName = this.getFileName(res);
    const url = this.convertBlobToUrl(res, fileName)
    this.downloadURI(url, fileName);
  }

  public getFileName(res) {
    const disposition = res?.headers?.get('Content-Disposition');
    const filename = decodeURIComponent(disposition?.split(';')[1]?.split('filename')[1]?.split('=')[1]?.trim())?.replace(/(^"|"$)/g, '');
    return filename || '';
  }

  public errorMessage(error) {
    if (error === 401) {
      return;
    }
    // Error message obj
    const convertMsg = (errorObj) => {
      // Is hasOwnProperty message
      if (errorObj?.message) {
        msg = errorObj?.message;
      }
      // Is hasOwnProperty errorBusinesses[]
      if (errorObj?.errorBusinesses) {
        let msgNew = '';
        errorObj?.errorBusinesses?.forEach(f => {
          msgNew += `${f?.code} - ${f?.message} \n `;
        });
        if (msgNew) {
          msg = msgNew;
        }
      }
    }

    // Default value
    let msg = error ? JSON.stringify(error) : this.translate.instant('COMMON.msg.try_again_later');

    // Is string
    if (typeof error === 'string') {
      msg = error;
    }

    // Is Blob
    if (error?.error instanceof Blob) {
      // Convert blob to string
      const url = URL.createObjectURL(error?.error);
      let xmlRequest = new XMLHttpRequest();
      xmlRequest.open('GET', url, false);
      xmlRequest.send();
      URL.revokeObjectURL(url);
      convertMsg(JSON.parse(xmlRequest?.responseText ?? null));
    } else {
      convertMsg(error?.error);
    }

    // OFF loading
    this.loadingOff();
    this.loadingCustomOff();

    // Display message
    swal({
      icon: "warning",
      title: this.translate.instant('COMMON.msg.error'),
      text: msg,
      buttons: {
        confirm: this.translate.instant('COMMON.btn.close'),
      },
    } as any);
  }

  /**
   * ========================
   * >>>>>> No loading <<<<<<
   * ========================
   */

  /**
   * @description GET HTTP
   * @param url: string
   * @return Observable
   */
  public getOffLoading(url: string, query?: any, option?: any): Observable<any> {
    let urlFinal = url;
    if (query) {
      urlFinal = url + '?' + this.buildQueryParam(query);
    }
    return this.httpClient.get(urlFinal, option);
  }

  /**
   * @description POST HTTP
   * @param url: string
   * @param body: any
   * @param option?: any
   * @return Observable
   */
  public postOffLoading(url: string, body: any, option?: any): Observable<any> {
    return this.httpClient.post(url, getTrimmedData(body), option);
  }

  /**
   * @description PUT HTTP
   * @param url: string
   * @param body: any
   * @return Observable
   */
  public putOffLoading(url: string, body: any): Observable<any> {
    return this.httpClient.put(url, getTrimmedData(body));
  }

}
