import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { TranslateService } from '@ngx-translate/core';
import swal from 'sweetalert'
import { configTextEditor } from 'src/app/_metronic/shared/shared/common/helper';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';

@Component({
  selector: 'app-consultation-modal',
  templateUrl: './consultation-modal.component.html',
  styleUrls: ['./consultation-modal.component.scss']
})
export class ConsultationModalComponent implements OnInit {

  public isVisible: boolean;
  public isSubmit: boolean;
  public formGroup: FormGroup;
  public dataDetail: any;
  public config = configTextEditor;
  public hoSoId: string;

  @Output() loadTimeLine = new EventEmitter();

  constructor(
    private api: ApiService,
    private fb: FormBuilder,
    private translate: TranslateService,
    private cdf: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.validate();
  }

  private validate(thamVan = null) {
    this.formGroup = this.fb.group({
      NoiDungTrinhKy: [thamVan?.noiDungTrinhKy ?? '', Validators.required],
      RaSoatNoiDung: [thamVan?.raSoatNoiDung ?? '', Validators.required],
      ThamVanThuKyTGD: [thamVan?.thamVanThuKyTGD ?? '', Validators.required],
    })
  }

  get f() { return this.formGroup.controls; }

  public showModal(item, hoSoId) {
    this.dataDetail = item;
    this.hoSoId = hoSoId;
    this.isVisible = true;
    this.isSubmit = false;
    this.validate(item?.thamVan);
  }

  public onSubmit() {
    this.isSubmit = true;

    if (this.formGroup.invalid) {
      return;
    }

    const formData = new FormData();
    formData.append("HoSoId", this.hoSoId);
    formData.append("ThamVan.NoiDungTrinhKy", this.f?.NoiDungTrinhKy?.value);
    formData.append("ThamVan.RaSoatNoiDung", this.f?.RaSoatNoiDung?.value);
    formData.append("ThamVan.ThamVanThuKyTGD", this.f?.ThamVanThuKyTGD?.value);

    this.api.post('/api/totrinh-duyetchi-pheduyet-list/phe-duyet', formData).subscribe(res => {
      if (res) {
        swal({
          icon: "success",
          title: 'Tạo thông tin tham vấn thành công!',
          buttons: {
            ok: this.translate.instant('COMMON.btn.close'),
          },
        } as any).then(() => {
          this.isVisible = false;
          this.loadTimeLine.emit();
          this.cdf.detectChanges();
        });
      }
    }, err => {
      this.api.errorMessage(err);
    });
  }

}
