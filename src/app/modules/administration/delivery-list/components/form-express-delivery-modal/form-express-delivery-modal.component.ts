import { Component, EventEmitter, Input, OnInit, Output, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import swal from 'sweetalert';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import { Options } from 'src/app/_metronic/shared/shared/models/options';
import { formatterInputNumber, parserInputNumber } from 'src/app/_metronic/shared/shared/common/helper';
import { deliveryDetail, deliveryList } from '../../models/delivery.model';

@Component({
  selector: 'app-form-express-delivery-modal',
  templateUrl: './form-express-delivery-modal.component.html',
  styleUrls: ['./form-express-delivery-modal.component.scss']
})
export class FormExpressDeliveryModalComponent implements OnInit {
  @Output() loadList = new EventEmitter();
  @Input() loaiOptions: Options[];

  // format input number
  public formatter = formatterInputNumber;
  public parser = parserInputNumber;

  public formGroup: FormGroup;
  public isVisible: boolean;

  public khuVucOptions: Options[] = [];
  public hinhThucOptions: Options[] = [];
  public loaiBuuPhamOptions: Options[] = [];
  public loaiThanhToanOptions: Options[] = [];
  public donViVanChuyenOptions: Options[] = [];
  public dongGoiOptions: Options[] = [];
  public dataDetail: deliveryDetail;
  public hoSoId: number;
  public isEditMode: boolean;

  constructor(
    private api: ApiService,
    private translate: TranslateService,
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  /**
   * Show modal
   */
  public showModal(item: deliveryList = null) {
    this.hoSoId = item?.hoSoId;
    this.isEditMode = this.hoSoId >= 0;
    this.getKhuVuc();
    this.getHinhThuc();
    this.getLoaiBuuPham();
    this.getThanhToan();
    this.getDongGoi();
    this.initForm();
    this.initDraft();
  }

  /**
   * Validate
   */
  private initForm() {
    this.formGroup = new FormGroup({
      tenNguoiNhan: new FormControl('', Validators.required),
      diaChiNguoiNhan: new FormControl('', Validators.required),
      khuVucKey: new FormControl('', Validators.required),
      ngayGiao: new FormControl('', Validators.required),
      noiDung: new FormControl(''),
      soLuong: new FormControl('', Validators.required),
      tenCongTyNhan: new FormControl(''),
      sdtNguoiNhan: new FormControl('', Validators.required),
      loaiBuuPhamKey: new FormControl(),
      trongLuong: new FormControl('', Validators.required),
      loaiThanhToanKey: new FormControl(),
      hinhThucChuyenKey: new FormControl(),
      dongGoiKey: new FormControl(),
    });
  }

  get f() { return this.formGroup.controls; }

  /**
   * Get khu vuc
   */
  public async getKhuVuc() {
    this.khuVucOptions = await this.api.get('/api/dangky-chuyephatnhanh-danhmuc/khu-vuc')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.khuVucKey, label: m.khuVucDisplay })))))
      .toPromise();
  }

  public async getHinhThuc() {
    this.hinhThucOptions = await this.api.get('/api/dangky-chuyephatnhanh-danhmuc/hinh-thuc-chuyen')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.hinhThucChuyenKey, label: m.hinhThucChuyenDisplay })))))
      .toPromise();
  }

  public async getLoaiBuuPham() {
    this.loaiBuuPhamOptions = await this.api.get('/api/dangky-chuyephatnhanh-danhmuc/loai-buu-pham')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.loaiBuuPhamKey, label: m.loaiBuuPhamDisplay })))))
      .toPromise();
  }

  public async getThanhToan() {
    this.loaiThanhToanOptions = await this.api.get('/api/dangky-chuyephatnhanh-danhmuc/loai-thanh-toan')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.loaiThanhToanKey, label: m.loaiThanhToanDisplay })))))
      .toPromise();
  }

  // public async getDonViVanChuyen() {
  //   this.donViVanChuyenOptions = await this.api.get('/api/dangky-chuyephatnhanh-danhmuc/donvi-vanchuyen')
  //     .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.donViVanChuyenKey, label: m.donViVanChuyenDisplay })))))
  //     .toPromise();
  // }

  public async getDongGoi() {
    this.dongGoiOptions = await this.api.get('/api/dangky-chuyephatnhanh-danhmuc/dong-goi')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.dongGoiKey, label: m.dongGoiDisplay })))))
      .toPromise();
  }

  /**
   * Submit+
   * Create
   */
  public onCreate() {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      const bodyParam = {
        ...this.formGroup.value,
        ngayGiao: Math.floor(new Date(this.f.ngayGiao.value).getTime() / 1000),
      };
      // Call api
      this.api.post(`/api/dangky-chuyephatnhanh-create`, bodyParam).subscribe(
        res => {
          if (res) {
            swal({
              icon: "success",
              title: 'Đăng ký chuyển phát nhanh thành công!',
              buttons: {
                ok: this.translate.instant('COMMON.btn.close'),
              },
            } as any).then(() => {
              this.reqSuccess();
            });
          }
        }, err => this.api.errorMessage(err));
    }
  }

  /**
   * Submit=
   * Update 
   */
  public onEdit() {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      const bodyParam = {
        ...this.formGroup.value,
        ngayGiao: Math.floor(new Date(this.f.ngayGiao.value).getTime() / 1000),
      };
      // Call api
      this.api.put(`/api/dangky-chuyephatnhanh-update/${this.hoSoId}`, bodyParam).subscribe(
        res => {
          if (res?.isSuccess) {
            swal({
              icon: "success",
              title: 'Cập nhật chuyển phát nhanh thành công!',
              buttons: {
                ok: this.translate.instant('COMMON.btn.close'),
              },
            } as any).then(() => {
              this.reqSuccess();
            });
          } else {
            this.api.errorMessage('Cập nhật chuyển phát nhanh không thành công!');
          }
        }, err => this.api.errorMessage(err));
    }
  }

  /**
   * Detect change
   * @param index 
   * @returns 
   */
  public trackByFn(index: number) {
    return index;
  }

  public initDraft() {
    this.isVisible = true;
    const data = JSON.parse(localStorage.getItem('CREATE_CHUYENPHATNHANH'));
    if (this.hoSoId) {
      // Get detail by id
      this.api.get('/api/dangky-chuyephatnhanh-update', { hoSoId: this.hoSoId }).subscribe(dataDetail => {
        // Patch value
        if (dataDetail) {
          this.formGroup.patchValue({
            tenNguoiNhan: dataDetail?.tenNguoiNhan ?? '',
            diaChiNguoiNhan: dataDetail?.diaChiNguoiNhan ?? '',
            ngayGiao: new Date(dataDetail?.ngayGiao * 1000),
            loaiDonKey: dataDetail.loaiDonKey ?? '',
            noiDung: dataDetail?.noiDung ?? '',
            soLuong: dataDetail?.soLuong ?? 0,
            trongLuong: dataDetail?.trongLuong ?? 0,
            tenCongTyNhan: dataDetail?.tenCongTyNhan ?? '',
            sdtNguoiNhan: dataDetail?.sdtNguoiNhan ?? '',
            khuVucKey: dataDetail?.khuVucKey ?? '',
            loaiThanhToanKey: dataDetail?.loaiThanhToanKey ?? '',
            hinhThucChuyenKey: dataDetail?.hinhThucChuyenKey ?? '',
            loaiBuuPhamKey: dataDetail?.loaiBuuPhamKey ?? '',
            dongGoiKey: dataDetail?.dongGoiKey ?? '',
          })
          this.f.khuVucKey.clearValidators(); // Don't required
        } else if (data) {
          this.formGroup.patchValue(data);
          this.f.khuVucKey.setValidators([Validators.required]); // required
        }
        this.f.khuVucKey.updateValueAndValidity();
      });
    } else if (data) {
      this.formGroup.patchValue(data);
      this.f.khuVucKey.setValidators([Validators.required]); // required
      this.f.khuVucKey.updateValueAndValidity();
    }
  }

  public saveDraft() {
    this.isVisible = false;
    localStorage.setItem('CREATE_CHUYENPHATNHANH', JSON.stringify(this.formGroup.value));
  }

  public removeDraft() {
    this.isVisible = false;
    localStorage.removeItem('CREATE_CHUYENPHATNHANH');
  }

  private reqSuccess() {
    this.loadList.emit();
    this.removeDraft();
  }
}
