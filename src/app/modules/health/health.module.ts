import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HealthRoutingModule } from './health-routing.module';
import { DeclarationComponent } from './declaration/declaration.component';
import { HealthComponent } from './health.component';
import { NgZorroAntdModule } from 'src/app/_metronic/shared/ng-zorro-antd/ng-zorro-antd.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [DeclarationComponent, HealthComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HealthRoutingModule,
    NgZorroAntdModule
  ]
})
export class HealthModule { }
