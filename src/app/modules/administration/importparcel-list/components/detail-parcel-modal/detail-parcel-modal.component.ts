import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import { ApproveParcelModalComponent } from './approve-parcel-modal/approve-parcel-modal.component';

@Component({
  selector: 'app-detail-import-parcel-modal',
  templateUrl: './detail-parcel-modal.component.html',
  styleUrls: ['./detail-parcel-modal.component.scss']
})
export class DetailParcelModalComponent implements OnInit {
  
  @ViewChild('approveExpressDelivery') approveExpressDelivery: ApproveParcelModalComponent;
  
  public isVisible = false;
  public dataDetail: any;
  public item: any;
  
  @Output() loadList = new EventEmitter;

  constructor(
    private api: ApiService
  ) { }

  ngOnInit(): void {
  }

  public showModal(item) {
    this.isVisible = true;
    this.item = item;
    this.loadDetail();
  }

  public loadDetail() {
    this.loadList.emit();
    this.api.get('/api/buupham-detail', { buuPhamId: this.item?.buuPhamId }).subscribe(res => {
      if (res) {
        this.dataDetail = res;
      }
    });
  }

}
