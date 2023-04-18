import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import swal from 'sweetalert';
import { Options } from 'src/app/_metronic/shared/shared/models/options';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';

@Component({
  selector: 'app-promulgate-create-modal',
  templateUrl: './promulgate-create-modal.component.html',
  styleUrls: ['./promulgate-create-modal.component.scss']
})
export class PromulgateCreateModalComponent implements OnInit {

  @Output() loadList = new EventEmitter;

  public step: number;
  public isVisible = false;

  // Step 1
  public formGroup: FormGroup;
  public phongBanOptions: Options[] = [];
  public dataDetail: any;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private cdf: ChangeDetectorRef,
    private translate: TranslateService,
  ) {
  }
  
  ngOnInit() {
    this.initForm();
  }
  
  public showModal(data: any) {
    this.step = 1;
    this.dataDetail = data;
    this.isVisible = true;
    this.getPhongBan();
    this.ngOnInit();
  }

  public initForm() {
    this.formGroup = this.fb.group({
      ngayBanHanh: ['', Validators.required],
      phongBanKey: [null, Validators.required],
    })
  }

  public get f() { return this.formGroup.controls; }

  public onSubmit() {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    const params = {
      ...this.formGroup.value,
      hoSoId: this.dataDetail?.hoSoId
    }

    this.api.post('/api/banhanh-create', params).subscribe(res => {
      if (res) {
        swal({
          icon: "success",
          title: 'Thêm ban hành thành công.',
          buttons: {
            ok: this.translate.instant('COMMON.btn.close'),
          },
        } as any).then(() => {
          this.isVisible = false;
          this.loadList.emit();
          this.cdf.detectChanges();
        });
      }
    }, err => {
      this.api.errorMessage(err);
    });
  }

  public async getPhongBan() {
    await this.api.get('/api/banhanh-dm/phong-ban')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m?.phongBanKey, label: m?.phongBanDisplay }))))).toPromise()
      .then(res => {
        if (res) {
          this.phongBanOptions = res;
        }
      }).catch(err => this.api.errorMessage(err));
  }
}

