import { Component, OnInit } from '@angular/core';
import { SubheaderService } from '../../_metronic/partials/layout';

@Component({
  selector: 'app-user-profile',
  template: '<router-outlet></router-outlet>',
})
export class UserProfileComponent implements OnInit {
  constructor(private subheader: SubheaderService) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.subheader.setTitle('User Profile');
      this.subheader.setBreadcrumbs([{
        title: 'User profile',
        linkText: 'User profile',
        linkPath: '/user-profile'
      }]);
    }, 1);
  }
}
