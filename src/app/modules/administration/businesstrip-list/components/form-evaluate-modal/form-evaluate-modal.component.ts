import { Options } from 'src/app/_metronic/shared/shared/models/options';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import swal from 'sweetalert';
import { formatterInputNumber, parserInputNumber } from 'src/app/_metronic/shared/shared/common/helper';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';

@Component({
  selector: 'app-form-evaluate-modal',
  templateUrl: './form-evaluate-modal.component.html',
  styleUrls: ['./form-evaluate-modal.component.scss']
})
export class FormEvaluateModalComponent implements OnInit {
  
  @Output() loadList = new EventEmitter;

  @Output() loadTimeLine = new EventEmitter();

  // format input number
  public formatter = formatterInputNumber;
  public parser = parserInputNumber;
  
  public formGroup: FormGroup;
  public isVisible: boolean;
  public isHieuLuc: boolean;
  

  public khuVucOptions: Options[] = [];
  public ngonNguOptions: Options[] = [];
  public loaiTaiLieuOptions: Options[] = [];
  public dataDetail: any;
  public dataModal: any;

  constructor(
    private api: ApiService,
    private translate: TranslateService,
    private cdf: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  /**
   * Show modal
   */
  async showModal(item = null) {
    this.isVisible = true;
    this.dataDetail = item;
    this.initForm();
  }

  /**
   * Validate
   */
  private initForm() {
    this.formGroup = new FormGroup({
      thoiGianDuaDon: new FormControl(10,[Validators.max(10),Validators.min(0)]),
      kyNangLaiXe: new FormControl(10,[Validators.max(10),Validators.min(0)]),
      trangPhuc: new FormControl(10,[Validators.max(10),Validators.min(0)]),
      loTrinh: new FormControl(10,[Validators.max(10),Validators.min(0)]),
      xuLySuCo: new FormControl(10,[Validators.max(10),Validators.min(0)]),
      tuanthuLuat: new FormControl(10,[Validators.max(10),Validators.min(0)]),
      hoTroDongMoCua: new FormControl(10,[Validators.max(10),Validators.min(0)]),
      GiaoTiep: new FormControl(10,[Validators.max(10),Validators.min(0)]),
      tienIchXe: new FormControl(10,[Validators.max(10),Validators.min(0)]),
      veSinhXe: new FormControl(10,[Validators.max(10),Validators.min(0)]),
    })
  }

  get f() { return this.formGroup.controls; }

  /**
   * Get khu vuc
   */


  /**
   * Submit+
   * Create
   */
  public onCreate() {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      const bodyParams = {
        maChuyenDi: this.dataDetail?.maChuyenDi,
        ...this.formGroup.value,
      }
      
      // Call api
      this.api.post(`/api/danh-gia-chuyen-di-create`, bodyParams).subscribe(
        res => {
          if (res) {
            swal({
              icon: "success",
              title: 'Bạn đã đánh giá chuyến đi thành công!',
              buttons: {
                ok: this.translate.instant('COMMON.btn.close'),
              },
            } as any).then(() => {
              this.isVisible = false;
              this.loadTimeLine.emit();
              this.cdf.detectChanges();
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
      const bodyParam = this.formGroup.value;
      // Call api
      this.api.put(`/dangky-chuyephatnhanh-update/${this.dataModal?.hoSoId}`, bodyParam).subscribe(
        res => {
          if (res?.isSuccess) {
            swal({
              icon: "success",
              title: 'Cập nhật chuyển phát nhanh thành công!',
              buttons: {
                ok: this.translate.instant('COMMON.btn.close'),
              },
            } as any).then(() => {
              this.isVisible = false;
              this.loadList.emit();
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

}
