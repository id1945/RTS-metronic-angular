import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';

@Component({
  selector: 'app-purchase',
  template: '<router-outlet></router-outlet>',
})
export class PurchaseComponent implements OnInit, OnDestroy {

  constructor(
    public api: ApiService,
  ) { }

  ngOnInit(): void {
  }

  /**
   * @description Lifecycle
   * @description Destroy
   * @return void
   */
  ngOnDestroy(): void {
  }

}
