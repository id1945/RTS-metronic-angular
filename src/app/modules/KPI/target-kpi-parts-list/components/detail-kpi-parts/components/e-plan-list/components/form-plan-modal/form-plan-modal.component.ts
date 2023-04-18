import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import serialize from '@octetstream/object-to-form-data';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import { configTextEditor } from 'src/app/_metronic/shared/shared/common/helper';
import { Options } from 'src/app/_metronic/shared/shared/models/options';
import swal from 'sweetalert';

enum mode {
  create,
  edit
}

declare type modeType = mode.create | mode.edit;

@Component({
  selector: 'app-form-plan-modal',
  templateUrl: './form-plan-modal.component.html',
  styleUrls: ['./form-plan-modal.component.scss'],
  exportAs: 'form-plan'
})
export class FormPlantModalComponent implements OnInit {
  @Output() loadList = new EventEmitter();

  public isVisible: boolean;
  public formGroup: FormGroup;
  public config = configTextEditor;
  public modeScreen: modeType;

  public TrangThaiTienDo: Options[] = [];
  public nguoiPhuTrachOptions: Options[] = [];

  public KPIKeHoachCongViecId: number; // Create
  public KPIKeHoachCongViecChiTietId: number; // Edit
  public kpiKeHoachCongViecChiTietThangId: number[] = []; // Edit

  constructor(
    private api: ApiService,
    private translate: TranslateService,
  ) { }

  ngOnInit(): void {
    // Init form
    this.formGroup = new FormGroup({
      NoiDungCongViec: new FormControl('', Validators.required),
      NguoiPhuTrachKeys: new FormControl(null, Validators.required),
      TieuChiDanhGia: new FormControl(''),
      TaiLieuDauRa: new FormControl(''),
      'Thang1.TrangThaiTienDoKey': new FormControl(''),
      'Thang2.TrangThaiTienDoKey': new FormControl(''),
      'Thang3.TrangThaiTienDoKey': new FormControl(''),
      'Thang4.TrangThaiTienDoKey': new FormControl(''),
      'Thang5.TrangThaiTienDoKey': new FormControl(''),
      'Thang6.TrangThaiTienDoKey': new FormControl(''),
      'Thang7.TrangThaiTienDoKey': new FormControl(''),
      'Thang8.TrangThaiTienDoKey': new FormControl(''),
      'Thang9.TrangThaiTienDoKey': new FormControl(''),
      'Thang10.TrangThaiTienDoKey': new FormControl(''),
      'Thang11.TrangThaiTienDoKey': new FormControl(''),
      'Thang12.TrangThaiTienDoKey': new FormControl(''),
      'Thang1.MoTa': new FormControl(''),
      'Thang2.MoTa': new FormControl(''),
      'Thang3.MoTa': new FormControl(''),
      'Thang4.MoTa': new FormControl(''),
      'Thang5.MoTa': new FormControl(''),
      'Thang6.MoTa': new FormControl(''),
      'Thang7.MoTa': new FormControl(''),
      'Thang8.MoTa': new FormControl(''),
      'Thang9.MoTa': new FormControl(''),
      'Thang10.MoTa': new FormControl(''),
      'Thang11.MoTa': new FormControl(''),
      'Thang12.MoTa': new FormControl(''),
    });
  }

  get f() { return this.formGroup.controls; }

  public async showModal(modeScreen?: modeType, id?: number) {
    this.modeScreen = modeScreen;
    this.isVisible = true;
    this.ngOnInit();
    // Load option
    await this.getNguoiPhuTrach();
    this.getTrangThaiTienDo();
    // Create mode
    if (modeScreen === 0 && id) {
      this.KPIKeHoachCongViecId = id;
    }
    // Edit mode
    if (modeScreen === 1 && id) {
      this.KPIKeHoachCongViecChiTietId = id;
      this.bindingForEdit()
    }
  }

  /**
   * CREATE
   */
  public onCreate() {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    const formData = serialize({
      KPIKeHoachCongViecId: this.KPIKeHoachCongViecId,
      ...this.formGroup.value
    });

    this.api.post('/api/kpimuctieu-nam-bophan-create/ke-hoach-cong-viec-chi-tiet', formData).subscribe(res => {
      if (res?.isSuccess) {
        // Message ok
        swal({
          icon: 'success',
          title: 'Thêm mới công việc thành công!',
          buttons: {
            ok: this.translate.instant('COMMON.btn.close'),
          },
        } as any).then(() => {
          this.isVisible = false;
          this.loadList.emit();
        });
      } else {
        this.api.errorMessage('Thêm mới công việc không thành công!');
      }
    }, err => this.api.errorMessage(err));
  }

  /**
   * EDIT
   */
  public onEdit() {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    // Add id
    const kpiKeHoachCongViecChiTietThangIdObj = {};
    this.kpiKeHoachCongViecChiTietThangId.forEach((id, index) => kpiKeHoachCongViecChiTietThangIdObj[`Thang${index + 1}.KPIKeHoachCongViecChiTietThangId`] = id);

    const formData = serialize({
      KPIKeHoachCongViecChiTietId: this.KPIKeHoachCongViecChiTietId,
      ...kpiKeHoachCongViecChiTietThangIdObj,
      ...this.formGroup.value,
    });

    this.api.post('/api/kpimuctieu-nam-bophan-update/ke-hoach-cong-viec-chi-tiet', formData).subscribe(res => {
      if (res?.isSuccess) {
        // Message ok
        swal({
          icon: 'success',
          title: 'Cập nhật công việc thành công!',
          buttons: {
            ok: this.translate.instant('COMMON.btn.close'),
          },
        } as any).then(() => {
          this.isVisible = false;
          this.loadList.emit();
        });
      } else {
        this.api.errorMessage('Cập nhật công việc không thành công!');
      }
    }, err => this.api.errorMessage(err));
  }

  public async getNguoiPhuTrach() {
    // null or black get all 
    this.nguoiPhuTrachOptions = await this.api.getOffLoading('/api/kpimuctieu-nam-bophan-dm/nhan-su-chiu-trach-nhiem', { SearchText: '' })
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.nhanSuChiuTrachNhiemKey, label: m.nhanSuChiuTrachNhiemDisplay }))))).toPromise();
  }

  public getTrangThaiTienDo() {
    this.api.get('/api/kpimuctieu-nam-bophan-dm/trang-thai-tien-do')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.trangThaiTienDoKey, label: m.trangThaiTienDoDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.TrangThaiTienDo = res;
        }
      });
  }

  private async bindingForEdit() {
    const data = await this.api.get('/api/kpimuctieu-nam-bophan-update/ke-hoach-cong-viec-chi-tiet', { KPIKeHoachCongViecChiTietId: this.KPIKeHoachCongViecChiTietId }).toPromise();
    if (data) {
      this.formGroup.patchValue({
        NoiDungCongViec: data?.noiDungCongViec ?? '',
        NguoiPhuTrachKeys: data?.nguoiPhuTrachKeys ?? null,
        TieuChiDanhGia: data?.tieuChiDanhGia ?? '',
        TaiLieuDauRa: data?.taiLieuDauRa ?? '',
        'Thang1.TrangThaiTienDoKey': data?.thang1?.trangThaiTienDoKey ?? '',
        'Thang2.TrangThaiTienDoKey': data?.thang2?.trangThaiTienDoKey ?? '',
        'Thang3.TrangThaiTienDoKey': data?.thang3?.trangThaiTienDoKey ?? '',
        'Thang4.TrangThaiTienDoKey': data?.thang4?.trangThaiTienDoKey ?? '',
        'Thang5.TrangThaiTienDoKey': data?.thang5?.trangThaiTienDoKey ?? '',
        'Thang6.TrangThaiTienDoKey': data?.thang6?.trangThaiTienDoKey ?? '',
        'Thang7.TrangThaiTienDoKey': data?.thang7?.trangThaiTienDoKey ?? '',
        'Thang8.TrangThaiTienDoKey': data?.thang8?.trangThaiTienDoKey ?? '',
        'Thang9.TrangThaiTienDoKey': data?.thang9?.trangThaiTienDoKey ?? '',
        'Thang10.TrangThaiTienDoKey': data?.thang10?.trangThaiTienDoKey ?? '',
        'Thang11.TrangThaiTienDoKey': data?.thang11?.trangThaiTienDoKey ?? '',
        'Thang12.TrangThaiTienDoKey': data?.thang12?.trangThaiTienDoKey ?? '',
        'Thang1.MoTa': data?.thang1?.moTa ?? '',
        'Thang2.MoTa': data?.thang2?.moTa ?? '',
        'Thang3.MoTa': data?.thang3?.moTa ?? '',
        'Thang4.MoTa': data?.thang4?.moTa ?? '',
        'Thang5.MoTa': data?.thang5?.moTa ?? '',
        'Thang6.MoTa': data?.thang6?.moTa ?? '',
        'Thang7.MoTa': data?.thang7?.moTa ?? '',
        'Thang8.MoTa': data?.thang8?.moTa ?? '',
        'Thang9.MoTa': data?.thang9?.moTa ?? '',
        'Thang10.MoTa': data?.thang10?.moTa ?? '',
        'Thang11.MoTa': data?.thang11?.moTa ?? '',
        'Thang12.MoTa': data?.thang12?.moTa ?? '',
      });
      // Save id
      this.kpiKeHoachCongViecChiTietThangId = [];
      Object.keys(data).forEach(key => {
        if (key.includes('thang')) {
          this.kpiKeHoachCongViecChiTietThangId.push(data?.[key]?.kpiKeHoachCongViecChiTietThangId);
        }
      });
    }
  }
}