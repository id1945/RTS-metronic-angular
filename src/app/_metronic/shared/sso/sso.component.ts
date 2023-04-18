import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { SSOService } from './sso.service';
import { environment } from 'src/environments/environment';

const authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;

@Component({
  selector: 'app-sso',
  template: '<router-outlet></router-outlet>',
})
export class SsoComponent implements OnInit {

  constructor(
    private sso: SSOService,
    private router: Router,
    private aRouter: ActivatedRoute
  ) { }

  ngOnInit(): void {
      const accessToken = this.sso.getAccessToken();
      if (accessToken) {
        // Get id_token 
        const id_token = this.aRouter.fragment['value']?.replace(/(access_token=)[\w\W\d]+(id_token=)|(&state=)[\w\W\d]+/g, '');
        // Store 
        localStorage.setItem(authLocalStorageToken, JSON.stringify({
          accessToken: accessToken,
          expires: sessionStorage.getItem('expires_at'),
          idToken: id_token
        }));
        this.router.navigate(['/']);
      } else {
        window.location.replace('/');
      }
  }
}
