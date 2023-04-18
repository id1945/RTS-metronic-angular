import { AuthService } from 'src/app/modules/auth';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import swal from 'sweetalert';
import { Options } from 'src/app/_metronic/shared/shared/models/options';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import { scrollEl, years } from 'src/app/_metronic/shared/shared/common/helper';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { SelectedFiles } from 'src/app/_metronic/shared/shared/services/files.service';
import serialize from '@octetstream/object-to-form-data';


@Component({
  selector: 'app-monthplan-form-modal',
  templateUrl: './monthplan-form-modal.component.html',
  styleUrls: ['./monthplan-form-modal.component.scss']
})
export class MonthPlanFormModalComponent implements OnInit {
  @Input() public isVisible = false;
  @Output() loadList = new EventEmitter;
  

  public step: number;
  public today = new Date();
  public scrollEl = scrollEl;

  // Step 1
  public formGroup1: FormGroup;
  public namOptions: Options[] = years(0, 5).map(m => ({ label: m.toString(), value: m.toString() }));
  public thangOptions: Options[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => ({ label: m.toString(), value: m.toString() }));
  public userInfo: any;
  public selectedFiles: SelectedFiles[] = [];
  public selectedFilesDetail: SelectedFiles[] = [];

  // Step 2
  public formGroup2: FormGroup;
  public isSpinning = false;
  public isForm2 = false;
  public tinhThanhOptions: Options[] = [];
  public quanHuyenOptions: Options[] = [];
  public quocGiaOptions: Options[] = [];
  public nguoiDiOptions: Options[] = [];
  public dataTable: any[] = [];
  public selectRowUuid: string;
  public diaDiemTrongNuoc: Options[] = [];
  public khctChiTietFiles: SelectedFiles[] = [];
  

  // Step 3

  // Edit mode
  public dataRow: any;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    public auth: AuthService,
    private cdf: ChangeDetectorRef,
    private translate: TranslateService,
  ) {
  }

  ngOnInit() {
    // Form step 1
    this.initForm1();
    // Form step 2
    this.initForm2();
  }

  /**
   * SHOW MODAL
   * @param data 
   */
  public async showModal(data = null) {
    this.step = 1;
    this.dataRow = data;
    this.isVisible = true;
    this.ngOnInit();

    this.diaDiemTrongNuoc= [];
    // Binding
    this.loadDraft();
    // 
    this.getTinhThanhOptions();
    this.getQuocGiaOptions();
    this.getNguoiDiOptions();
  }

  /**
   * Step 1
   * Init or reset FormGroup
   */
  private initForm1() {
    this.selectedFiles = [];
    this.formGroup1 = this.fb.group({
      namKey: ['', Validators.required],
      thangKey: ['', Validators.required],
    });
  }

  get f1() { return this.formGroup1.controls; }

  /**
   * Step 2
   * Init or reset FormGroup
   */
  private initForm2() {
    // Flag
    this.isSpinning = false;
    // FormGroup
    this.khctChiTietFiles = [];
    this.formGroup2 = this.fb.group({
      noiDung: ['', Validators.required],
      ghiChu: [''],
      soLuongNguoiDi: ['', Validators.required],
      nguoiDiKey: ['', Validators.required],
      ngayDi: ['', Validators.required],
      ngayVe: ['', Validators.required],
      isTrongNuoc: [true, Validators.required],
      quocGiaKey: [''],
      quocGiaChiTiet: [''],
      tinhThanhKey: ['', Validators.required],
      // quanHuyenKey: ['', Validators.required],
      isManageByPBP: [false],
      isManageByPTGD: [false],
    })
    this.f2.isTrongNuoc.valueChanges.subscribe(res => {
      if (res) {
        // Quoc gia
        this.f2.quocGiaKey.clearValidators();
        // Tinh thanh - Quan huyen
        this.f2.tinhThanhKey.setValidators([Validators.required]);
        // this.f2.quanHuyenKey.setValidators([Validators.required]);
      } else {
        // Quoc gia
        this.f2.quocGiaKey.setValidators([Validators.required]);
        // Tinh thanh - Quan huyen
        this.f2.tinhThanhKey.clearValidators();
        // this.f2.quanHuyenKey.clearValidators();
      }
      this.f2.quocGiaKey.updateValueAndValidity();
      this.f2.tinhThanhKey.updateValueAndValidity();
      // this.f2.quanHuyenKey.updateValueAndValidity();
    });
    this.f2.tinhThanhKey.valueChanges.subscribe(res => {
      if (res) {
        // this.f2.quanHuyenKey.setValue(null);
        // this.getQuanHuyenOptions(res);
      }
    });
  }

  get f2() { return this.formGroup2.controls; };

  public trackByFn(index: number, item: any) {
    return index;
  }

  /**
   * CREATE
   * @returns 
   */
  public onCreate(isApprove: boolean) {
    if (this.formGroup1.invalid || this.dataTable?.length === 0) {
      return;
    }

    const params = {
      ...this.formGroup1.value,
      KHCTs: this.dataTable?.map(m => {
        delete m?.uuid;
        return {
          ...m,
          ngayDi: Math.floor(new Date(m.ngayDi).getTime() / 1000),
          ngayVe: Math.floor(new Date(m.ngayVe).getTime() / 1000),
          diaDiemTrongNuoc: {
            items: this.diaDiemTrongNuoc?.map(m => ({ tinhThanhKey: m.meta?.tinhThanhKey }))
          }
        };
      }),
    };

    delete params.fArray;

    let formData = serialize(params);

    this.selectedFiles.forEach(f => {
      formData.append('DinhKems', f?.file);
    })

    const url = isApprove? "/api/kehoach-congtac-create" : "/api/kehoach-congtac-create/save-to-draft";
    const title = isApprove? "Trình duyệt kế hoạch công tác thành công !" : "Thêm mới kế hoạch công tác thành công!";

    this.api.post(url, formData).subscribe(res => {
      if (res?.isSuccess) {
        // Message ok
        swal({
          icon: 'success',
          title: title,
          buttons: {
            ok: this.translate.instant('COMMON.btn.close'),
          },
        } as any).then(() => {
          this.isVisible = false;
          this.loadList.emit();
          this.removeDraft();
        });
      } else {
        this.api.errorMessage('Thêm mới kế hoạch công tác không thành công!');
      }
    }, err => {
      this.api.errorMessage(err);
    });
  }


  public onEdit(isApprove: boolean) {
    if (this.formGroup1.invalid || this.dataTable?.length === 0) {
      return;
    }

    const params = {
      ...this.formGroup1.value,
      HoSoId: this.dataRow?.hoSoId,
      KHCTs: this.dataTable?.map(m => {
        delete m?.uuid;
        return {
          ...m,
          ngayDi: Math.floor(new Date(m.ngayDi).getTime() / 1000),
          ngayVe: Math.floor(new Date(m.ngayVe).getTime() / 1000),
          diaDiemTrongNuoc: {
            items: this.diaDiemTrongNuoc?.map(m => ({ tinhThanhKey: m.meta?.tinhThanhKey }))
          }
        };
      }),
    };

    delete params.fArray;

    let formData = serialize(params);

    this.selectedFiles.forEach(f => {
      formData.append('DinhKems', f?.file);
    })

    const url = isApprove? "/api/kehoach-congtac-create" : "/api/kehoach-congtac-update";
    const title = isApprove? "Trình duyệt kế hoạch công tác thành công !" : "Sửa kế hoạch công tác thành công!";

    this.api.post(url, formData).subscribe(res => {
      if (res?.isSuccess) {
        // Message ok
        swal({
          icon: 'success',
          title: title,
          buttons: {
            ok: this.translate.instant('COMMON.btn.close'),
          },
        } as any).then(() => {
          this.isVisible = false;
          this.loadList.emit();
          this.removeDraft();
        });
      } else {
        this.api.errorMessage('Sửa kế hoạch công tác không thành công!');
      }
    }, err => {
      this.api.errorMessage(err);
    });
  }

  /**
   * Submit form 2
   */
  onSubmitForm2(scollEl: HTMLElement) {
    // Validate form
    if (this.formGroup2.invalid) {
      this.formGroup2.markAllAsTouched();
      return
    }

    // Loading
    // this.isSpinning = true;
    debugger
    console.log('this.formGroup2.valid',this.formGroup2.valid)
    var tinhThanhLabbel = ''
    for (var val of this.diaDiemTrongNuoc) {
      tinhThanhLabbel = tinhThanhLabbel  + val.meta?.tinhThanhLabel + ','; // prints values: 10, 20, 30, 40
    }
    
    // Update data
    if (this.selectRowUuid) {
      // Update
      this.dataTable = this.dataTable.map(m => this.selectRowUuid === m.uuid ? ({ uuid: m.uuid, ...this.formGroup2.value,  diaDiemTrongNuocArr : [...this.diaDiemTrongNuoc]  }) : (m));
    } else {
      // Add new
      const uuid = new Date().getTime().toString() + Math.random().toString(36).substring(2);
      this.dataTable.push({ uuid: uuid, ...this.formGroup2.value, diaDiemTrongNuocArr : [...this.diaDiemTrongNuoc]  });
    }

    // Scroll xuống table
    this.scrollEl(scollEl, 500);

    // Close form2
    this.initForm2();
    this.isForm2 = false;
    this.selectRowUuid = null;
    this.diaDiemTrongNuoc = []
  }

  public onEditRow(item : any){
    this.formGroup2.patchValue(item); this.isForm2 = true; 
    this.diaDiemTrongNuoc = [...item.diaDiemTrongNuocArr]
    this.selectRowUuid = item.uuid
  }

  public onDeleteItemTableForm2(uuid: string) {
    this.dataTable = this.dataTable.filter((f) => f.uuid !== uuid);
  }

  public onThemDiaChiTrongNuoc() {
    if (this.f2.tinhThanhKey.valid) {
      this.diaDiemTrongNuoc.push({
        value: null,
        label: null,
        meta: {
          tinhThanhKey: this.f2.tinhThanhKey.value,
          // quanHuyenKey: this.f2.quanHuyenKey.value,
          tinhThanhLabel: this.getObjOptions('tinhThanhOptions', this.f2.tinhThanhKey.value).label,
          // quanHuyenLabel: this.getObjOptions('quanHuyenOptions', this.f2.quanHuyenKey.value).label,
        }
      });
    } else {
      this.api.errorMessage('Chưa chọn Tỉnh thành và Quận huyện!');
    }
  }

  public onXoaDiaChi(index: number) {
    this.diaDiemTrongNuoc = this.diaDiemTrongNuoc.filter((f, i) => i !== index);
  }

  public nextStep(index) {
    if (index == 2 && this.formGroup1.invalid) {
      this.formGroup1.markAllAsTouched();
      return // reject
    }
    if (index == 3 && this.dataTable.length === 0 || this.formGroup1.invalid) {
      this.formGroup2.markAllAsTouched();
      return // reject
    }
    if (index) {
      this.step = index; // Next
    } else {
      this.step += 1; // Next ++
    }
  }

  public prevStep() {
    this.step -= 1;
  }

  public getNguoiDiOptions() {
    this.api.get('/api/kehoach-congtac-dm/nguoi-di')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.nguoiDiKey, label: m.nguoiDiDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.nguoiDiOptions = res;
        }
      });
  }

  public getTinhThanhOptions() {
    this.api.get('/api/kehoach-congtac-dm/tinh-thanh')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.tinhThanhKey, label: m.tinhThanhDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.tinhThanhOptions = res;
        }
      });
  }

  public getQuanHuyenOptions(TinhThanhKey: string) {
    this.api.get('/api/kehoach-congtac-dm/quan-huyen', { TinhThanhKey: TinhThanhKey })
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.quanHuyenKey, label: m.quanHuyenDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.quanHuyenOptions = res;
        }
      });
  }

  public getQuocGiaOptions() {
    this.api.get('/api/kehoach-congtac-dm/quoc-gia')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.quocGiaKey, label: m.quocGiaDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.quocGiaOptions = res;
        }
      });
  }

  public getObjOptions(dataName: string, key: string) {
    return this[dataName]?.find(f => f?.value === key);
  }

  public getlabelTinhThanh() {
    var tinhThanhLabbel = ''
    for (var val of this.diaDiemTrongNuoc) {
      tinhThanhLabbel = tinhThanhLabbel  + val.meta?.tinhThanhLabel + ','; // prints values: 10, 20, 30, 40
    }
    return tinhThanhLabbel;
  }

  public saveDraft() {
    // Save draft
    this.isVisible = false;
    const data = {
      formGroup1: this.formGroup1.value,
      dataTable: this.dataTable,
    }
    if (!this.dataRow) {
      // Create mode
      localStorage.setItem('MONTHPLAN_DRAFT', JSON.stringify(data));
    }
  }

  public async loadDraft() {
    // Edit mode
    if (this.dataRow) {
      const queryPrams = {
        HoSoId: this.dataRow?.hoSoId,
      }
      await this.api.get('/api/kehoach-congtac-update', queryPrams).toPromise().then(res => {
        this.formGroup1.patchValue({
           namKey: res?.namKey,
           thangKey: res?.thangKey,
          // loaiNghiepVuKey: res?.loaiNghiepVuKey,
          // mucDich: res?.mucDich,
          // kieuMuaSamKey: res?.kieuMuaSamKey,
        });
        this.dataTable = res?.khcTs.map( item=>{
          const diaDiemTrongNuoc = item?.diaDiemTrongNuoc?.items
          console.log(diaDiemTrongNuoc);
          let obj = {
            noiDung : item?.noiDung,
            ghiChu : item?.ghiChu,
            soLuongNguoiDi : item?.soLuongNguoiDi,
            nguoiDiKey : item?.nguoiDiKey,
            isTrongNuoc : item?.isTrongNuoc,
            quocGiaKey : item?.quocGiaKey,
            quocGiaChiTiet: item?.quocGiaChiTiet,
            tinhThanhKey : item?.tinhThanhKey,
            ngayDi : item?.ngayDi *1000,
            ngayVe : item?.ngayVe*1000,
            isManageByPBP : item?.isManageByPBP,
            isManageByPTGD : item?.isManageByPTGD,
            diaDiemTrongNuoc : [...item?.diaDiemTrongNuoc?.items],
            uuid:new Date().getTime().toString() + Math.random().toString(36).substring(2)
          }
          console.log(obj)
          return obj;
        })
        // this.selectedFilesDetail = res?.dinhKem?.map(m1 => ({
        //   items: m1?.items?.map(m2 => ({
        //     tenFile: m2?.tenFile ?? '',
        //     urlDownload: m2.urlDownload ?? ''
          
        //   }))
        // })).map(m => m?.items)?.flat();
      });
    } else {
      // Create mode
      const dataObjStr = localStorage.getItem('MONTHPLAN_DRAFT');
      if (dataObjStr) {
        const data = JSON.parse(dataObjStr);
        this.formGroup1.patchValue(data?.formGroup1);
        this.dataTable = data.dataTable ?? [];
      }
    }
  }


  
  public removeDraft() {
    this.formGroup1.reset();
    this.formGroup2.reset();

    localStorage.removeItem('MONTHPLAN_DRAFT');
    this.cdf.detectChanges();
  }


}

