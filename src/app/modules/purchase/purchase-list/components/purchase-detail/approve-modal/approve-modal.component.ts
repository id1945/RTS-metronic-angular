import { Component, OnInit, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import swal from 'sweetalert'
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import { DynamicAsideMenuService } from 'src/app/_metronic/core';
import { PurchaseDetail } from '../../models/purchase-detail.model';

@Component({
  selector: 'app-approve-modal',
  templateUrl: './approve-modal.component.html',
  styleUrls: ['./approve-modal.component.scss']
})
export class ApproveModalComponent implements OnInit {

  public isVisible: boolean;
  public formGroup: FormGroup;
  public dataDetail: PurchaseDetail;
  public IsAccept: boolean;

  @Output() loadTimeLine = new EventEmitter();

  constructor(
    private api: ApiService,
    private cdf: ChangeDetectorRef,
    private menu: DynamicAsideMenuService
  ) { }

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      ghiChu: new FormControl('', Validators.required),
      ghiChuEng: new FormControl('', Validators.required),
    })
  }

  get f() { return this.formGroup.controls; }

  public showModal(item: PurchaseDetail, IsAccept = false) {
    this.dataDetail = item;
    this.IsAccept = IsAccept;
    this.isVisible = true;
    this.ngOnInit();
  }

  async onSubmitApprove() {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      if (this.dataDetail?.isAllowResponseThamVan) {
        // Tham vấn => approve
        this.thamVan();
      } else {
        // approve
        this.approve();
      }
    }
  }

  /**
   * Tham vấn
   * @param idYCMH
   */
  private thamVan() {
    if (this.dataDetail?.thamVan.noiDungThuKiThamVans?.length === 0) {
      this.approve();
    } else {
      const bodyPramasPhanHoi = {
        idYCMH: this.dataDetail?.id ?? '',
        noiDungTrinhKi: this.dataDetail?.thamVan?.noiDungTrinhKi ?? '',
        noiDungKiemTra: this.dataDetail?.thamVan?.noiDungKiemTra ?? '',
        noiDungThamVans: this.dataDetail?.thamVan?.noiDungThuKiThamVans?.map(m => {
          return {
            noiDungThuKiThamVan: m?.noiDungThamVan ?? '',
            isPheDuyet: m?.isDaPheDuyet ?? false,
            noiDungPhanHoi: m?.noiDungPhanHoi ?? '',
            lineId: m?.lineId ?? ''
          }
        }) ?? []
      }
      this.api.post('/api/purchase-product-update/tham-van-update', bodyPramasPhanHoi).subscribe(res => {
        if (res?.isSuccess) {
          swal({
            icon: "success",
            title: "Tham vấn thành công",
            buttons: {
              ok: "Đóng"
            },
          } as any).then(() => {
            this.approve();
          });
        } else {
          swal({
            icon: "warning",
            title: "Tham vấn không thành công!",
            buttons: {
              ok: "Đóng"
            },
          } as any).then(() => {
            this.close();
          });
        }
      }, err => {
        this.close();
        this.api.errorMessage(err);
      });
    }
  }

  /**
   * Phê duyệt
   */
  private approve() {
    var Action = "Accept";
    if (!this.IsAccept) {
      Action = "Reject";
    }

    const formData = new FormData();
    formData.append("IdYCMH", this.dataDetail?.id?.toString());
    formData.append("MaYCMH", this.dataDetail?.maYCMH);
    formData.append("GhiChu", this.f?.ghiChu?.value);
    formData.append("GhiChuEng", this.f?.ghiChuEng?.value);
    formData.append("Action", Action);

    // Approve
    this.api.post('/api/purchase-product-update/approve', formData).subscribe(res => {
      this.api.loadingCustomOff();
      if (res) {
        swal({
          icon: "success",
          title: this.IsAccept == true ? "Bạn đã phê duyệt Yêu cầu mua sắm thành công!" : "Bạn đã từ chối Yêu cầu mua sắm thành công!",
          buttons: {
            ok: "Đóng"
          },
        } as any).then(() => {
          this.close();
          // Update badges menu
          this.menu.loadBadgesMuaHang();
        });
      }
    }, err => {
      this.api.errorMessage(err);
    });
  }

  private close() {
    this.isVisible = false;
    this.loadTimeLine.emit();
    this.cdf.detectChanges();
  }
}
