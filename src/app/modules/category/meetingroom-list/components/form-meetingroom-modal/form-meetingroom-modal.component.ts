import { Options } from 'src/app/_metronic/shared/shared/models/options';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import swal from 'sweetalert';
import { formatterInputNumber, parserInputNumber } from 'src/app/_metronic/shared/shared/common/helper';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';

@Component({
  selector: 'app-form-meetingroom-modal',
  templateUrl: './form-meetingroom-modal.component.html',
  styleUrls: ['./form-meetingroom-modal.component.scss']
})
export class FormMeetingroomModalComponent implements OnInit {
  @Output() loadList = new EventEmitter;

  // format input number
  public formatter = formatterInputNumber;
  public parser = parserInputNumber;
  
  public formGroup: FormGroup;
  public isVisible: boolean;
  public isHieuLuc: boolean;

  public khuVucOptions: Options[] = [];
  public dataDetail: any;
  public dataModal: any;

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
  async showModal(item = null) {
    this.isVisible = true;
    this.dataModal = item;
    this.initForm();
  }

  /**
   * Validate
   */
  private initForm() {
    this.formGroup = new FormGroup({
      tenPhongHop: new FormControl('', Validators.required),
      maPhongHop: new FormControl('', Validators.required),
      toiDa: new FormControl(),
      ghiChu: new FormControl(),
    })
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

  /**
   * Submit+
   * Create
   */
  public onCreate() {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      const bodyParam = this.formGroup.value;
      // Call api
      this.api.post(`/api/phong-hop-create`, bodyParam).subscribe(
        res => {
          if (res) {
            swal({
              icon: "success",
              title: 'Thêm mới thành công!',
              buttons: {
                ok: this.translate.instant('COMMON.btn.close'),
              },
            } as any).then(() => {
              this.isVisible = false;
              this.loadList.emit();
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
