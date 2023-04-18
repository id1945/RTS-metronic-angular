import { Component, OnInit, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import swal from 'sweetalert'
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import { DynamicAsideMenuService } from 'src/app/_metronic/core';
import { SupplierSelectionDetail } from '../../../models/supplier-selection-detail.model';

@Component({
  selector: 'app-approve-supplier-modal',
  templateUrl: './approve-supplier-modal.component.html',
  styleUrls: ['./approve-supplier-modal.component.scss']
})
export class ApproveSupplierModalComponent implements OnInit {

  public isVisible: boolean;
  public formGroup: FormGroup;
  public dataDetail: SupplierSelectionDetail;
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

  public showModal(item: SupplierSelectionDetail, IsAccept = false) {
    this.dataDetail = item;
    this.IsAccept = IsAccept;
    this.isVisible = true;
    this.ngOnInit();
  }

  public onSubmitApprove() {
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
   * @param idDeXuat
   */
  private thamVan() {
    if (this.dataDetail?.thamVan.noiDungThuKiThamVans?.length === 0) {
      this.approve();
    } else {
      // Validate noiDungPhanHoi
      const bodyPramasPhanHoi = {
        idDeXuat: this.dataDetail?.idDeXuat ?? '',
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
      this.api.post('/api/purchase-requisition-create/phan-hoi-tham-van', bodyPramasPhanHoi).subscribe(res => {
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
    var UrlApprove = '/api/purchase-requisition-create/phe-duyet';
    if (!this.IsAccept) {
      UrlApprove = '/api/purchase-requisition-create/tu-choi';
    }

    const formData = {
      idDeXuat: this.dataDetail?.idDeXuat,
      ghiChu: this.f?.ghiChu?.value,
      GhiChuEng: this.f?.ghiChuEng?.value,
    }

    // Approve
    this.api.post(UrlApprove, formData).subscribe(res => {
      this.api.loadingCustomOff();
      if (res) {
        swal({
          icon: "success",
          title: this.IsAccept == true ? "Bạn đã phê duyệt thành công!" : "Bạn đã từ chối thành công!",
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
