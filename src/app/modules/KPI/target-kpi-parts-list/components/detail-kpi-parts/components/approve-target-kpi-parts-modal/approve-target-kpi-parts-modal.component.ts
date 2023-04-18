import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import serialize from '@octetstream/object-to-form-data';
import swal from 'sweetalert';
import { SelectedFiles } from 'src/app/_metronic/shared/shared/services/files.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-approve-target-kpi-parts-modal',
  templateUrl: './approve-target-kpi-parts-modal.component.html',
  styleUrls: ['./approve-target-kpi-parts-modal.component.scss'],
  exportAs: 'approve-target-kpi-parts'
})
export class ApproveTargetKpiPartsModalComponent implements OnInit {

  @Output() loadList = new EventEmitter();

  public isVisible: boolean;
  public formGroup: FormGroup;

  public IsAccept: boolean;
  public kpiMucTieuNamBoPhanId: any;
  public selectedFiles: SelectedFiles[] = [];

  constructor(
    private router: Router,
    public api: ApiService,
  ) { }

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      noiDung: new FormControl(''),
    })
  }

  get f() { return this.formGroup.controls; }

  public showModal(kpiMucTieuNamBoPhanId: any, IsAccept: boolean = false) {
    this.kpiMucTieuNamBoPhanId = kpiMucTieuNamBoPhanId;
    this.IsAccept = IsAccept;
    this.isVisible = true;
    this.ngOnInit();
    this.checkRequired();
  }

  private checkRequired() {
    if (!this.IsAccept) {
      this.f['noiDung'].setValidators([Validators.required]);
    } else {
      this.f['noiDung'].clearValidators();
    }
    this.f['noiDung'].updateValueAndValidity();
  }

  async onSubmitApprove() {
    this.formGroup.markAllAsTouched();

    if (this.formGroup.valid) {
      const url = this.IsAccept ? '/api/kpimuctieu-nam-bophan-create/phe-duyet' : '/api/kpimuctieu-nam-bophan-create/tu-choi';

      const formData = serialize({
        KPIMucTieuNamBoPhanId: this.kpiMucTieuNamBoPhanId,
        NoiDung: this.f.noiDung.value
      });

      this.selectedFiles?.forEach(f => {
        formData.append("DinhKems", f.file);
      })

      // POST
      this.api.post(url, formData).subscribe(res => {
        if (res?.isSuccess) {
          swal({
            icon: "success",
            title: this.IsAccept == true ? "Phê duyệt yêu cầu thành công!" : "Từ chối yêu cầu thành công!",
            buttons: {
              ok: "Đóng"
            },
          } as any).then(() => {
            this.isVisible = false;
            this.router.navigate(['/', 'KPI', 'target-kpi-parts']);
            // this.loadList.emit();
          });
        } else {
          this.api.errorMessage(this.IsAccept == true ? "Phê duyệt yêu cầu không thành công!" : "Từ chối yêu cầu không thành công!")
        }
      }, err => {
        this.api.errorMessage(err);
      });
    }
  }
}
