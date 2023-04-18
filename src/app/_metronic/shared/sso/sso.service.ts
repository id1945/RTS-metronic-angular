import { ApiService } from './../http/api.service';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { JwksValidationHandler } from 'angular-oauth2-oidc';
import { environment } from 'src/environments/environment';

const authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;

@Injectable()
export class SSOService {

  constructor(
    private router: Router,
    private api: ApiService,
    private oauthService: OAuthService,
  ) {
    this.configureOauthService();
  }

  private configureOauthService() {

    this.oauthService.configure(window['sso']);
    /** enable below validation only if jwks object is defined as part of oauthconfig obj */
    // this.oauthService.tokenValidationHandler = new JwksValidationHandler();
    this.oauthService.setStorage(sessionStorage);

    /** commented below because below resource is protected by some identity server ex: wso2 */
    // this.oauthService.loadDiscoveryDocumentAndTryLogin();

    this.oauthService.tryLogin();
  }

  public initImplicitFlow() {
    this.oauthService.initImplicitFlow();
  }

  public getAccessToken(): string {
    return this.oauthService.getAccessToken();
  }

  public getIdentityClaims(): object {
    return this.oauthService.getIdentityClaims();
  }

  public get hasValidAccessToken(): boolean {
    return this.oauthService.hasValidAccessToken();
  }

  public loginSSO() {
    this.api.loadingCustomOn();
    this.initImplicitFlow();
  }
  
  public logout(): void {
    const idToken = JSON.parse(localStorage.getItem(authLocalStorageToken))?.idToken;
    if (idToken) {
      localStorage.clear();
      sessionStorage.clear();
      const url = `${window['sso']?.logoutUrl}?id_token_hint=${idToken}&state=state_1`;
      window.location.replace(url);
    } else {
      localStorage.clear();
      window.location.replace('/');
    }
  }
}