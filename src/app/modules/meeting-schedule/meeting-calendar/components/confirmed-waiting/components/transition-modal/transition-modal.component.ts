import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Options } from 'src/app/_metronic/shared/shared/models/options';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import swal from 'sweetalert';

@Component({
  selector: 'app-transition-modal',
  templateUrl: './transition-modal.component.html',
  styleUrls: ['./transition-modal.component.scss'],
  exportAs: 'transition'
})
export class TransitionModalComponent implements OnInit {

  @Output() loadList = new EventEmitter();

  public isVisible = false;
  public formGroup: FormGroup;
  public phongBanOptions: Options[] = [];
  public nhanVienOptions: Options[] = [];
  public congViecId: number;

  constructor(
    private api: ApiService,
    private translate: TranslateService,
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm() {
    this.formGroup = new FormGroup({
      boPhanKey: new FormControl('', Validators.required),
      nhanVienKey: new FormControl('', Validators.required)
    });
  }

  get f() { return this.formGroup.controls; }

  public showModal(item) {
    this.congViecId = item?.congViecId;
    this.isVisible = true;
    this.initForm();
    this.getPhongBan();
  }

  public getPhongBan() {
    this.api.get('/api/lich-lam-viec-dm/phong-ban')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.phongBanKey, label: m.phongBanDisplay })))))
      .subscribe(res => {
        if (res) {
          this.phongBanOptions = res;
        }
      })
  }

  public getNhanVien(key) {
    this.api.get('/api/lich-lam-viec-dm/nhan-vien', { PhongBanKey: key })
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.nhanVienKey, label: m.nhanVienDisplay })))))
      .subscribe(res => {
        if (res) {
          this.nhanVienOptions = res;
        }
      })
  }

  public onChuyenTiep() {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return false;
    }
    const params = {
      congViecId: Number(this.congViecId),
      nhanVienKey: this.f.nhanVienKey.value
    }
    // Request
    this.api.post('/api/lich-lam-viec-create/chuyen-tiep-lich-hop', params).subscribe(res => {
      if (res?.isSuccess) {
        if (res) {
          swal({
            icon: 'success',
            title: 'Chuyển tiếp lịch họp thành công!',
            buttons: {
              ok: this.translate.instant('COMMON.btn.close'),
            },
          } as any).then(() => {
            this.isVisible = false;
            this.loadList.emit();
          });
        }
      } else {
        this.api.errorMessage('Chuyển tiếp lịch họp không thành công!');
      }
    }, err => this.api.errorMessage(err));
  }
}
