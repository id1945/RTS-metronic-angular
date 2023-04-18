import { Component, OnInit } from '@angular/core';
import { PurchaseDetail } from '../../models/purchase-detail.model';

@Component({
  selector: 'app-table-full-modal',
  templateUrl: './table-full-modal.component.html',
  styleUrls: ['./table-full-modal.component.scss']
})
export class TableFullModalComponent implements OnInit {

  public dataDetail: PurchaseDetail;
  public isVisible = false;

  constructor() { }

  ngOnInit(): void {
  }

  public showModal(data: any /*Detail*/) {
    this.dataDetail = data;
    this.isVisible = true;
  }

}
