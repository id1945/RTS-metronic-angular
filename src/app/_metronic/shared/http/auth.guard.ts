import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/modules/auth';
import { DynamicAsideMenuService } from 'src/app/_metronic/core';
import { environment } from 'src/environments/environment';
import { SSOService } from '../sso/sso.service';
import { ApiService } from './api.service';

const authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(
    private api: ApiService,
    private sso: SSOService,
    private authService: AuthService,
    private menu: DynamicAsideMenuService,
  ) { }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    const token = JSON.parse(localStorage.getItem(authLocalStorageToken));
    if (!token) {
      this.loginSSO();
      return false;
    }

    // UserInfo data
    let currentUser = this.authService.currentUserValue;

    // SSO pass then get userInfo
    if (this.sso.hasValidAccessToken && !currentUser) {
      this.api.loadingCustomOn();
      await new Promise((resolve) => {
        this.authService.getUserByToken().subscribe().add(resolve);
      });
      currentUser = this.authService.currentUserValue;
      this.api.loadingCustomOff();
    }

    // Check isAllow
    if (currentUser) {
      // pass login
      return true;
    } else {
      // not pass
      this.authService.logout();
      return false;
    }
  }

  async canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // Check permission
    if (!this.menu.menuPermission$.value) {
      await this.menu.loadPermissions();
    }
    const r = childRoute.data;
    const isAllow = this.menu.menuPermission$.value?.find(f => f.controller == r?.screenKey || r?.screenKey === 'allow');
    return !!isAllow;
  }

  public loginSSO() {
    this.api.loadingCustomOn();
    // initCodeFlow
    this.sso.initImplicitFlow();
  }
}
