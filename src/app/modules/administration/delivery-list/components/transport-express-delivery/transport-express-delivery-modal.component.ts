import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import { Options } from 'src/app/_metronic/shared/shared/models/options';
import swal from 'sweetalert';

@Component({
  selector: 'app-transport-express-delivery-modal',
  templateUrl: './transport-express-delivery-modal.component.html',
  styleUrls: ['./transport-express-delivery-modal.component.scss']
})
export class TransportExpressDeliveryModalComponent implements OnInit {

  public isVisible: boolean;
  public formGroup: FormGroup;
  public dataDetail: any;
  public IsAccept: boolean;

  public loaiVanChuyenOptions: Options[] = [];

  @Output() loadList = new EventEmitter();
  @Input() loaiOptions: Options[];

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      maVanDon: new FormControl(''),
      donViVanChuyenKey: new FormControl(''),
    })

    this.getTypeVanChuyenOptions();
  }

  get f() { return this.formGroup.controls; }

  public showModal(item: any) {
    this.dataDetail = item;
    this.isVisible = true;
    this.ngOnInit();
    this.checkRequired();
  }

  private checkRequired() {
    if (!this.IsAccept) {
      this.f['maVanDon'].setValidators([Validators.required]);
    } else {
      this.f['maVanDon'].clearValidators();
    }
    this.f['maVanDon'].updateValueAndValidity();
  }

  public getTypeVanChuyenOptions() {
    this.api.get('/api/dangky-chuyephatnhanh-danhmuc/donvi-vanchuyen')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.donViVanChuyenKey, label: m.donViVanChuyenDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.loaiVanChuyenOptions = res;
        }
      })
  }

  async onSubmitApprove() {
    this.formGroup.markAllAsTouched();

    if (this.formGroup.invalid) {
      return;
    }

    const url = '/api/dangky-chuyephatnhanh-update/van-don';
    const bodyParams = {
      hoSoId: this.dataDetail?.hoSoId,
      ...this.formGroup?.value,
    }
    // POST
    this.api.post(url, bodyParams).subscribe(res => {
      if (res) {
        swal({
          icon: "success",
          title: "Bạn đã cập nhật mã vận đơn thành công!",
          buttons: {
            ok: "Đóng"
          },
        } as any).then(() => {
          this.isVisible = false;
          this.loadList.emit();
        });
      } else {
        this.api.errorMessage('Cập nhật mã vận đơn không thành công!')
      }
    }, err => {
      this.api.errorMessage(err);
    });
  }
}
