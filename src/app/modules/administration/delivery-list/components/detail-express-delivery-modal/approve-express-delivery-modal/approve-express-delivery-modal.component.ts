import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { DynamicAsideMenuService } from 'src/app/_metronic/core';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import { Options } from 'src/app/_metronic/shared/shared/models/options';
import swal from 'sweetalert';

@Component({
  selector: 'app-approve-express-delivery-modal',
  templateUrl: './approve-express-delivery-modal.component.html',
  styleUrls: ['./approve-express-delivery-modal.component.scss']
})
export class ApproveExpressDeliveryModalComponent implements OnInit {

  public isVisible: boolean;
  public formGroup: FormGroup;
  public dataDetail: any;
  public IsAccept: boolean;
  public IsDisPlayDonViVanChuyen: boolean

  public donViVanChuyenOptions: Options[] = [];

  @Output() loadTimeLine = new EventEmitter();

  constructor(
    private api: ApiService,
    private menu: DynamicAsideMenuService
  ) { }

  ngOnInit(): void {
    this.getDonViVanChuyen();
    this.formGroup = new FormGroup({
      noiDung: new FormControl(''),
      donViVanChuyenKey: new FormControl(''),
    })
  }

  get f() { return this.formGroup.controls; }

  public showModal(item: any, IsAccept: boolean) {
    this.dataDetail = item;
    this.IsAccept = IsAccept;
    this.isVisible = true;
    this.ngOnInit();
    this.checkRequired();
  }

  private checkRequired() {
    if (!this.IsAccept) {
      this.IsDisPlayDonViVanChuyen = false;
      this.f['noiDung'].setValidators([Validators.required]);
    } else {
      this.IsDisPlayDonViVanChuyen = true;
      this.f['noiDung'].clearValidators();
    }
    this.f['noiDung'].updateValueAndValidity();
  }

  public async getDonViVanChuyen() {
    this.donViVanChuyenOptions = await this.api.get('/api/dangky-chuyephatnhanh-danhmuc/donvi-vanchuyen')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.donViVanChuyenKey, label: m.donViVanChuyenDisplay })))))
      .toPromise();
  }

  async onSubmitApprove() {
    this.formGroup.markAllAsTouched();

    if (this.formGroup.invalid) {
      return;
    }

    const url = this.IsAccept ? '/api/dangky-chuyephatnhanh-create/phe-duyet' : '/api/dangky-chuyephatnhanh-create/tu-choi';
    const bodyParams = {
      hoSoId: this.dataDetail?.hoSoId,
      ...this.formGroup?.value,
    }
    // POST
    this.api.post(url, bodyParams).subscribe(res => {
      if (res) {
        swal({
          icon: "success",
          title: this.IsAccept == true ? "Phê duyệt yêu cầu thành công!" : "Từ chối yêu cầu thành công!",
          buttons: {
            ok: "Đóng"
          },
        } as any).then(() => {
          this.isVisible = false;
          this.loadTimeLine.emit();
          this.menu.loadBadgesMyJobInHomePage();
        });
      } else {
        this.api.errorMessage(null)
      }
    }, err => {
      this.api.errorMessage(err);
    });
  }
}
