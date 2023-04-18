import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-basic-content-modal',
  templateUrl: './basic-content-modal.component.html',
  styleUrls: ['./basic-content-modal.component.scss'],
  exportAs: 'basic-content'
})
export class BasicContentModalComponent {

  public isVisible = false;
  public data: any;

  @Input() title: string = '';
  @Input() width: number = 500;
  
  constructor() {
  }

  public showModal(data = null) {
    this.isVisible = true;
    this.data = data;
  }
}
