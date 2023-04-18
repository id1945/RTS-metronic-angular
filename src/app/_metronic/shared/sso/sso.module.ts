import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SsoRoutingModule } from './sso-routing.module';
import { SsoComponent } from './sso.component';
import { SSOService } from './sso.service';


@NgModule({
  declarations: [SsoComponent],
  imports: [
    CommonModule,
    SsoRoutingModule
  ],
  providers: [SSOService]
})
export class SsoModule { }
