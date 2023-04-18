import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import {
  concatMap,
  delay,
  retryWhen,
  finalize,
  catchError,
} from 'rxjs/operators';
import { ApiService } from './api.service';
import { environment } from 'src/environments/environment';
import { TranslationService } from '../i18n/translation.service';
import { TranslateService } from '@ngx-translate/core';
import swal from 'sweetalert';
import { SSOService } from '../sso/sso.service';

@Injectable()
export class InterceptorService implements HttpInterceptor {

  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;

  /**
   * @description Retry HTTP requests
   * @description Number of retry: 1
   * @description Delay: 1000ms = 1sec
   * @description Status: [408, 429, 500, 502, 503, 504]
   */
  private retry = {
    count: 1,
    delay: 1000,
    status: [204, 408, 429, 500, 502, 503, 504],
  };

  /**
   * @description Lifecycle
   * @param router: Router
   * @param api: ApiService
   * @return void
   */
  constructor(
    private router: Router,
    private api: ApiService,
    private sso: SSOService,
    private translate: TranslateService,
    private translation: TranslationService,
  ) { }

  /**
   * @description Return true is accept
   * @description Return false do not accept
   * @param request: HttpRequest
   * @param next: HttpHandler
   * @return Observable
   */
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // Check expired
    this.tokenExpired();
    // Set access token
    if (this.accessToken) {
      request = this.addToken(request, this.accessToken); // Api token
    }
    return next.handle(request).pipe(
      retryWhen((error) =>
        // Retry request
        error.pipe(
          concatMap((err, count) => this.retryContent(err, count)),
          delay(this.retry.delay)
        )
      ),
      catchError((error) => {
        this.api.loadingOff();
        // If is true, Access Token Handle
        if (error instanceof HttpErrorResponse) {
          // If status 401, Post http refreshToken
          // If status other, throw error
          if (error.status === 401) {
            // If is true, POST refreshToken
            // If is false, throw error
            swal({
              icon: 'error',
              title: this.translate.instant('COMMON.msg.expires'),
              buttons: {
                ok: this.translate.instant('COMMON.btn.close'),
              },
            } as any).then(() => {
              this.sso.logout();
            });
            return throwError(error.status);
          } else {
            this.showErrorPage(error);
            return throwError(error);
          }
        }
      }),
      finalize(() => {
        // End http request
        setTimeout(() => {
          this.api.loadingOff();
        }, 300);
      })
    );
  }

  /**
   * @description Add header authorization
   * @param request: HttpRequest
   * @param token: string
   * @return HttpRequest
   */
  private addToken(
    request: HttpRequest<any>,
    token: string
  ): HttpRequest<unknown> {
    return request.clone({
      setHeaders: {
        'Authorization': `Bearer ${token}`,
        'language': this.translation.getSelectedLanguage(),
      }
    });
  }

  /**
   * @description Retry content
   * @param error: any
   * @param count: number
   * @return Observable
   */
  private retryContent(error: any, count: number): Observable<any> {
    if (count < this.retry.count && this.retry.status.includes(error?.status)) {
      return of(error);
    }
    return throwError(error);
  }

  /**
   * @description Access Token
   * @description Get Access Token
   * @return string
   */
  private get accessToken(): string {
    try {
      const authData = JSON.parse(localStorage.getItem(this.authLocalStorageToken));
      return authData ? authData?.accessToken : null;
    } catch (error) {
      return undefined;
    }
  }

  /**
   * Check phiên làm việc
   * @returns 
   */
  private tokenExpired() {
    const authData = JSON.parse(localStorage.getItem(this.authLocalStorageToken));
    const timestmp = authData?.expires?.toString()?.length === 10 ? authData?.expires * 1000 : authData?.expires;
    // reject
    if (!authData && !timestmp) return false; 
    // handle check
    // console.log(Number(timestmp));
    // console.log('expires:',new Date(Number(timestmp)).valueOf(), new Date().valueOf(), new Date(timestmp).valueOf() < new Date().valueOf());
    if (new Date(Number(timestmp)).valueOf() < new Date().valueOf()) {
      swal({
        icon: 'error',
        title: this.translate.instant('COMMON.msg.expires'),
        buttons: {
          ok: this.translate.instant('COMMON.btn.close'),
        },
      } as any).then(() => {
        this.sso.logout();
      });
    }
  }

  /**
   * @description Show error page
   * @param error: HttpErrorResponse
   * @return void
   */
  private showErrorPage(error: HttpErrorResponse): void {
    // List of unwanted system errors
    // 500: Internal Server Error
    // 501: Not Implemented
    // 502: Bad Gateway
    // 503: Service Unavailable
    // 504: Gateway Timeout
    // 505: HTTP Version Not Supported
    const status = [500, 501, 502, 503, 504, 505];
    // Check does exist
    const isShowError = status.includes(error?.status);
    if (isShowError) {
      // Redirect to error page
      this.router.navigate(['/', 'error', 'server', error?.status], {
        queryParams: { status: error?.status },
      });
    }
  }
}