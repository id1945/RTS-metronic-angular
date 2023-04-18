import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import { NotificationService } from 'src/app/_metronic/shared/shared/services/notification.service';
import { LayoutService } from '../../../../../core';

@Component({
  selector: 'app-notifications-offcanvas',
  templateUrl: './notifications-offcanvas.component.html',
  styleUrls: ['./notifications-offcanvas.component.scss'],
})
export class NotificationsOffcanvasComponent implements OnInit {
  public extrasNotificationsOffcanvasDirectionCSSClass: string;

  constructor(
    public notification: NotificationService,
    private layout: LayoutService,
    public api: ApiService,
  ) { }

  ngOnInit(): void {
    this.extrasNotificationsOffcanvasDirectionCSSClass = `offcanvas-${this.layout.getProp(
      'extras.notifications.offcanvas.direction'
    )}`;
    this.notification.ngOnInit();
  }

}