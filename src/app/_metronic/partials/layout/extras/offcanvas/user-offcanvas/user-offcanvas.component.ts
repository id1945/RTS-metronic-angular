import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { NotificationService } from 'src/app/_metronic/shared/shared/services/notification.service';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import { SSOService } from 'src/app/_metronic/shared/sso/sso.service';
import { AuthService, UserModel } from 'src/app/modules/auth';
import { LayoutService } from 'src/app/_metronic/core';

@Component({
  selector: 'app-user-offcanvas',
  templateUrl: './user-offcanvas.component.html',
  styleUrls: ['./user-offcanvas.component.scss'],
})
export class UserOffcanvasComponent implements OnInit {
  public extrasUserOffcanvasDirection = 'offcanvas-right';
  public user$: Observable<UserModel>;

  constructor(
    public notification: NotificationService,
    private layout: LayoutService,
    private auth: AuthService,
    public api: ApiService,
    private sso: SSOService
  ) { }

  ngOnInit(): void {
    this.extrasUserOffcanvasDirection = `offcanvas-${this.layout.getProp(
      'extras.user.offcanvas.direction'
    )}`;
    this.user$ = this.auth.currentUserSubject.asObservable();
  }

  public logout() {
    if (this.sso.hasValidAccessToken) {
      this.sso.logout();
    } else {
      this.auth.logout();
    }
  }

  public changePassword() {
    
  }
}
