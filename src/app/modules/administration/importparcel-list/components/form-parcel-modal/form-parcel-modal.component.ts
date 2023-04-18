import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, of } from 'rxjs';
import { debounceTime, switchMap, tap } from 'rxjs/operators';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import { Options } from 'src/app/_metronic/shared/shared/models/options';
import swal from 'sweetalert';
import { NguoiNhan } from '../../models/nguoi-nhan.model';

@Component({
  selector: 'app-form-parcel-modal',
  templateUrl: './form-parcel-modal.component.html',
  styleUrls: ['./form-parcel-modal.component.scss']
})
export class FormParcelModalComponent implements OnInit {
  @Output() loadList = new EventEmitter;

  public formGroup: FormGroup;
  public isVisible: boolean;
  public isSubmit: boolean;

  public nguoiNhanOptions: NguoiNhan[] = [];
  public isLoadingOption: boolean;
  public nguoiNhanSelected: NguoiNhan;
  public loaiOptions: Options[] = [];

  // update
  public buuPhamId: string;
  public searchCBBP$ = new BehaviorSubject(null);

  constructor(
    private api: ApiService,
    private translate: TranslateService,
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.searchCBBP$.pipe(tap(res => this.isLoadingOption = (res ? true : false)), debounceTime(1000)).subscribe(res => res && this.onSearchCBNhanBP(res));
  }

  /**
   * Show modal
   */
  async showModal(buuPhamId = null) {
    this.buuPhamId = buuPhamId;
    this.initForm();
    this.initDraft();
    this.getTypeOptions();
  }

  /**
   * Validate
   */
  private initForm() {
    this.formGroup = new FormGroup({
      tenNguoiGui: new FormControl('', Validators.required),
      tenCongTyGui: new FormControl(),
      sdtNguoiGui: new FormControl(),
      diaChiNguoiGui: new FormControl('', Validators.required),
      ngayGiao: new FormControl(),
      hinhThucKey: new FormControl(),
      nguoiNhanId: new FormControl(null, Validators.required),
    })
  }

  get f() { return this.formGroup.controls; }

  /**
   * Submit+
   * Create
   */
  public onCreate() {
    this.isSubmit = true;
    if (this.formGroup.valid) {
      const bodyParams = this.formGroup.value;
      this.api.post('/api/buupham-create', bodyParams).subscribe(
        res => {
          if (res?.isSuccess) {
            swal({
              icon: "success",
              title: 'Tạo mới thành công!',
              buttons: {
                ok: this.translate.instant('COMMON.btn.close'),
              },
            } as any).then(() => {
              this.isVisible = false;
              this.loadList.emit();
            });
          } else {
            this.api.errorMessage('Tạo mới không thành công!');
          }
        }, err => {
          this.api.errorMessage(err);
        });
    }
  }

  /**
   * Submit+
   * Create
   */
  public onEdit() {
    this.isSubmit = true;
    if (this.formGroup.valid) {
      const bodyParams = this.formGroup.value;
      this.api.put(`/api/buupham-update/${this.buuPhamId}`, bodyParams).subscribe(
        res => {
          if (res?.isSuccess) {
            swal({
              icon: "success",
              title: 'Cập nhật thành công!',
              buttons: {
                ok: this.translate.instant('COMMON.btn.close'),
              },
            } as any).then(() => {
              this.isVisible = false;
              this.loadList.emit();
            });
          } else {
            this.api.errorMessage('Cập nhật không thành công!');
          }
        }, err => {
          this.api.errorMessage(err);
        });
    }
  }

  /**
  * Get loại options
  */
  public getTypeOptions() {
    this.api.get('/api/buupham-danhmuc/hinh-thuc')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.hinhThucKey, label: m.hinhThucDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.loaiOptions = res;
        }
      })
  }


  public onSearchCBNhanBP(e) {
    const queryParam = {
      SearchText: e,
      Page: 1,
      ItemsPerPage: 20
    }
    this.api.getOffLoading('/api/buupham-danhmuc/nguoi-nhan', queryParam).subscribe(data => {
      this.nguoiNhanOptions = data?.items;
      this.isLoadingOption = false;
    }, err => {
      this.isLoadingOption = false;
      this.api.errorMessage(err)
    }
    );
  }

  public onSelectCBNhanBP(e) {
    this.nguoiNhanSelected = this.nguoiNhanOptions?.find((f: NguoiNhan) => f?.nguoiDungId === e);
  }

  public async initDraft() {
    this.isSubmit = false;
    this.nguoiNhanSelected = null;
    const data = JSON.parse(localStorage.getItem('CREATE_BUUPHAM'))
    if (data) {
      if (this.buuPhamId) {
        // Edit mode
        const detail = await this.api.get('/api/buupham-detail', { buuPhamId: this.buuPhamId }).toPromise();
        this.formGroup.patchValue(detail);
        try {
          this.formGroup.patchValue({ ngayGiao: new Date(detail?.ngayGiao * 1000).toISOString() });
        } catch (error) { }
      } else {
        // Create mode
        this.formGroup.patchValue(data);
      }
      this.isVisible = true;
    } else {
      this.isVisible = true;
    }
  }

  public saveDraft() {
    this.isVisible = false;
    localStorage.setItem('CREATE_BUUPHAM', JSON.stringify(this.formGroup.value))
  }
}
