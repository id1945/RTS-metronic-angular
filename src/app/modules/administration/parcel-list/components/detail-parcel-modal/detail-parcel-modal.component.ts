import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import swal from 'sweetalert';

@Component({
  selector: 'app-detail-parcel-modal',
  templateUrl: './detail-parcel-modal.component.html',
  styleUrls: ['./detail-parcel-modal.component.scss']
})
export class DetailParcelModalComponent implements OnInit {

  public dataDetail: any;
  public isVisible = false;

  @Output() loadTimeLine = new EventEmitter();

  constructor(    private api: ApiService,    private cdf: ChangeDetectorRef,) { }

  ngOnInit(): void {
  }

  public showModal(item = null): void {
    this.isVisible = true;
    this.dataDetail = item;
  }

  async onSubmit(buuPhamId) {

    const bodyParams = {
      buuPhamId: buuPhamId
    }
    // POST
    this.api.put('/api/buupham-update/chan-chan-nhan', bodyParams).subscribe(res => {
      if (res) {
        swal({
          icon: "success",
          title: "Bạn đã xác nhận thành công!",
          buttons: {
            ok: "Đóng"
          },
        } as any).then(() => {
          this.isVisible = false;
          this.loadTimeLine.emit();
          this.cdf.detectChanges();
        });
      } else {
        this.api.errorMessage(null)
      }
    }, err => {
      this.api.errorMessage(err);
    });
  }

  async onReject(buuPhamId) {

    const bodyParams = {
      buuPhamId: buuPhamId
    }
    // POST
    this.api.put('/api/buupham-update/tu-choi-nhan', bodyParams).subscribe(res => {
      if (res) {
        swal({
          icon: "success",
          title: "Bạn đã xác nhận không nhận bưu phẩm thành công!",
          buttons: {
            ok: "Đóng"
          },
        } as any).then(() => {
          this.isVisible = false;
          this.loadTimeLine.emit();
          this.cdf.detectChanges();
        });
      } else {
        this.api.errorMessage(null)
      }
    }, err => {
      this.api.errorMessage(err);
    });
  }

}
