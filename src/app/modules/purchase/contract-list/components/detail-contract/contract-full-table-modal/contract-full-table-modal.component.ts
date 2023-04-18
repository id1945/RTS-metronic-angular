import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contract-full-table-modal',
  templateUrl: './contract-full-table-modal.component.html',
  styleUrls: ['./contract-full-table-modal.component.scss']
})
export class ContractFullTableModalComponent implements OnInit {

  public isVisible = false;
  public dataDetail: any;

  constructor() { }

  ngOnInit(): void {
  }

  public showModal(dataDetail = null) {
    this.dataDetail = dataDetail;
    this.isVisible = true;
  }

}
