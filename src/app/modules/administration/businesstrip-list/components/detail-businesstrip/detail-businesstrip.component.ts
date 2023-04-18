import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AuthService } from 'src/app/modules/auth';
import { DetailChuyenDi, XeDuaDon, XeDuaDonNguoiDi } from '../../models/xe-dua-don.model';
import { FinishBussinessTripModalComponent } from './finish-bussinesstrip-modal/finish-bussinesstrip-modal.component';
import { RejectBussinessTripModalComponent } from './reject-bussinesstrip-modal/reject-bussinesstrip-modal.component';
import { RunningBussinessTripModalComponent } from './running-bussinesstrip-modal/running-bussinesstrip-modal.component';
import { Options } from 'src/app/_metronic/shared/shared/models/options';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import swal from 'sweetalert';
import { FormEvaluateModalComponent } from '../form-evaluate-modal/form-evaluate-modal.component';

@Component({
  selector: 'app-detail-businesstrip',
  templateUrl: './detail-businesstrip.component.html',
  styleUrls: ['./detail-businesstrip.component.scss']
})
export class DetailBusinessTripComponent implements OnInit {

  @ViewChild('rejectBussinessTrip') rejectBussinessTrip: RejectBussinessTripModalComponent;
  @ViewChild('runningBussinessTrip') runningBussinessTrip: RunningBussinessTripModalComponent;
  @ViewChild('finishBussinessTrip') finishBussinessTrip: FinishBussinessTripModalComponent;
  @ViewChild('finishBussinessTrip') formEvaluate: FormEvaluateModalComponent;

  public today = new Date();
  public params: Params;

  // DETAIL
  public dataDetail: XeDuaDon;
  public dataChuyenDiDetail: DetailChuyenDi;
  public tenNguoiPheDuyet: string;
  // EDIT
  public formGroup: FormGroup;
  public boPhanOptions: Options[];
  public hoTenOptions: Options[];

  public nguoiDis: XeDuaDonNguoiDi = {
    nguoiDiEmployeeKey: '',
    nguoiDiDepartmentKey: '',
  }

  constructor(
    private api: ApiService,
    private fb: FormBuilder,
    private cdf: ChangeDetectorRef,
    private aRoute: ActivatedRoute,
    private userService: AuthService,
  ) { }

  ngOnInit(): void {
    this.aRoute.params.subscribe(params => {
      if (params) {
        this.params = params;
        this.getChuyenDiDetail()
      }
    });
    this.initFormEdit();
    //======= Load data
    this.getBoPhan();
  }

  /**
   * START EDIT
   */

  private initFormEdit() {
    this.formGroup = this.fb.group({
      taiXeId: [],
      taiXeHoTen: [],
      taiXeSoDT: [],
      isTaiXeKhac: [true],
      xeDonId: [],
      xeDonBienSo: [],
      xeDonTenXe: [],
      isXeKhac: [true],
      thoiGianDon: [],
      diaChiDon: [],
      hinhThucDichVu: ['', Validators.required],
      matKhauThanhToan: [],
      taiKhoanThanhToan: [],
      ghiChu: [],
      nguoiDis: this.fb.array([]),
      // Not allow body params
      maChuyenDi: [],
      nguoiTao: [],
    })
  }

  get f() { return this.formGroup.controls; }
  get fNguoiDis() { return this.f.nguoiDis; }

  /**
  * @param item 
  * @returns 
  */
  public createItem(nguoiDi: XeDuaDonNguoiDi) {
    return this.fb.group({
      nguoiDiEmployeeKey: [nguoiDi?.nguoiDiEmployeeKey, Validators.required],
      nguoiDiDepartmentKey: [nguoiDi?.nguoiDiDepartmentKey, Validators.required]
    })
  }

  /**
   * Add item
   */
  public addRow(nguoiDi: XeDuaDonNguoiDi = null) {
    let dataCreate = this.nguoiDis;
    if (nguoiDi) {
      dataCreate = nguoiDi;
    }
    (this.f.nguoiDis as FormArray).push(this.createItem(dataCreate));
  }

  /**
   * Remove item
   * @param idx 
   */
  public removeRow(idx: number): void {
    (this.f.nguoiDis as FormArray).removeAt(idx);
  }

  public getBoPhan() {
    this.api.get('/api/chuyendi-danhmuc/nguoidi-department')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m?.nguoiDiDepartmentKey, label: m?.nguoiDiDepartmentDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.boPhanOptions = res;
        }
      });
  }

  public getHoTen(boPhanKey: string) {
    this.nguoiDis.nguoiDiDepartmentKey = boPhanKey;
    this.api.get('/api/chuyendi-danhmuc/nguoidi-employee', { nguoiDiDepartmentKey: boPhanKey })
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m?.nguoiDiEmployeeKey, label: m?.nguoiDiEmployeeDisplay, role: m?.chucVuDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.hoTenOptions = res;
        }
      });
  }

  public onAddNguoiDi(hoTenKey: string) {
    this.nguoiDis.nguoiDiEmployeeKey = hoTenKey;
    if (this.nguoiDis) {
      this.addRow();
    }
  }

  public getObjByKeyOptions(dataName: string, key: string) {
    return this[dataName]?.find(f => f?.value === key);
  }

  public getObjByLabelOptions(dataName: string, label: string) {
    return this[dataName]?.find(f => f?.label === label);
  }

  public onEdit() {
    if (this.formGroup.invalid || this.fNguoiDis?.value?.length === 0) {
      this.formGroup.markAllAsTouched();
      return;
    }

    let bodyParams = {
      ...this.formGroup.value
    }

    // Not allow body params
    delete bodyParams.nguoiTao;
    delete bodyParams.maChuyenDi;

    this.api.put(`/chuyendi-update/${this.params?.id}`, bodyParams).subscribe(res => {
      if (res) {
        this.initFormEdit();
        this.getChuyenDiDetail();
      }
    })
  }

  public xacNhanHanhTrinh(item :any)  {
    const url = '/api/chuyendi-update/xac-nhan-hanh-trinh';
    const bodyParams = {
      id:item?.id
    }
    // POST
    this.api.post(url, bodyParams).subscribe(res => {
      if (res?.isSuccess) {
        swal({
          icon: "success",
          title: "Bạn đã xác nhận hành trình thành công!",
          buttons: {
            ok: "Đóng"
          },
        } as any).then(() => {
          this.getChuyenDiDetail();
          this.cdf.detectChanges();
        });
      } else {
        this.api.errorMessage(null)
      }
    }, err => {
      this.api.errorMessage(err);
    });
  }

  public khongXacNhanHanhTrinh(item :any)  {
    const url = '/api/chuyendi-update/khong-xac-nhan-hanh-trinh';
    const bodyParams = {
      id:item?.id
    }
    // POST
    this.api.post(url, bodyParams).subscribe(res => {
      if (res?.isSuccess) {
        swal({
          icon: "success",
          title: "Bạn đã xác nhận không đúng hành trình thành công!",
          buttons: {
            ok: "Đóng"
          },
        } as any).then(() => {
          this.getChuyenDiDetail();
          this.cdf.detectChanges();
        });
      } else {
        this.api.errorMessage(null)
      }
    }, err => {
      this.api.errorMessage(err);
    });
  }


  /**
   * START DETAIL
   */
  public getChuyenDiDetail() {
    const query = {
      id: this.params?.id
    };
    this.api.get('/api/chuyendi-detail', query).subscribe(res => {
      if (res) {
        this.dataChuyenDiDetail = res;
        this.getDangKyDetail(res.hoSoIdYeuCau);
        this.cdf.detectChanges();
        // Init data form
        this.formGroup.patchValue({
          maChuyenDi: this.dataChuyenDiDetail.maChuyenDi,
          taiXeHoTen: this.dataChuyenDiDetail.taiXeHoTen,
          xeDonBienSo: this.dataChuyenDiDetail.xeDonBienSo,
          thoiGianDon: this.dataChuyenDiDetail.thoiGianDon,
          matKhauThanhToan: this.dataChuyenDiDetail.matKhauThanhToan,
          taiKhoanThanhToan: this.dataChuyenDiDetail.taiKhoanThanhToan,
          taiXeSoDT: this.dataChuyenDiDetail.taiXeSoDT,
          xeDonTenXe: this.dataChuyenDiDetail.xeDonTenXe,
          diaChiDon: this.dataChuyenDiDetail.diaChiDon,
          ghiChu: this.dataChuyenDiDetail.ghiChu,
        })
      }
    })
    this.tenNguoiPheDuyet = this.userService.currentUserValue.hoTen;
  }

 


  public getDangKyDetail(hoSoId) {
    const query = {
      hoSoId: hoSoId
    };
    this.api.get('/api/xeduadon-detail', query).subscribe(res => {
      if (res) {
        this.dataDetail = res;
        this.cdf.detectChanges();
        // Init data form
        this.formGroup.patchValue({
          nguoiTao: this.dataDetail.nguoiDatHoTen,
          hinhThucDichVu: this.dataDetail.hinhThucLaiXeDisplay,
        })
        this.dataDetail.nguoiDi?.items?.forEach((el: XeDuaDonNguoiDi) => {
          const item = {
            ...el,
            nguoiDiEmployeeKey: this.getObjByLabelOptions('hoTenOptions', el.nguoiDiEmployeeDisplay)?.value,
            nguoiDiDepartmentKey: this.getObjByLabelOptions('boPhanOptions', el.nguoiDiDepartmentDisplay)?.value
          }
          this.addRow(item);
        });
      }
    })
  }
}
