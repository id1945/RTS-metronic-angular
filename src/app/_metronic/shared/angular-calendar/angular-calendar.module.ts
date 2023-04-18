import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContextMenuModule } from './context-menu/context-menu.module';
import { CalendarHeaderModule } from './calendar-header/calendar-header.module';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';



@NgModule({
  imports: [
    CommonModule,
    CalendarHeaderModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    ContextMenuModule.forRoot({
      useBootstrap4: true,
    }),
  ],
  exports: [
    CalendarModule,
    ContextMenuModule,
    CalendarHeaderModule
  ]
})
export class AngularCalendarModule { }
