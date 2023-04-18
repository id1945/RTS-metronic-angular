import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import { Options } from 'src/app/_metronic/shared/shared/models/options';

@Component({
  selector: 'app-add-ingredients-modal',
  templateUrl: './add-ingredients-modal.component.html',
  styleUrls: ['./add-ingredients-modal.component.scss'],
  exportAs: 'add-ingredients'
})
export class AddIngredientsModalComponent implements OnInit {

  @Output() thanhPhan = new EventEmitter();

  @Input() apiCreate = '';
  @Input() apiStt = '';

  public isVisible: boolean;
  public formGroup: FormGroup;
  public dataDetail: any;

  public trangThaiOptions: Options[] = [];

  constructor(
    private api: ApiService,
  ) { }

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      tenThanhPhan: new FormControl('', Validators.required),
      stt: new FormControl(0),
      trangThaiThanhPhanKey: new FormControl(''),
    })
  }

  get f() { return this.formGroup.controls; }

  public showModal(data?: any) {
    this.dataDetail = data;
    this.isVisible = true;
    this.ngOnInit();
    // Load options
    this.getTrangThaiOptions();
  }

  public getTrangThaiOptions() {
    this.api.get(this.apiStt)
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.trangThaiThanhPhanKey, label: m.trangThaiThanhPhanDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.trangThaiOptions = res;
        }
      })
  }

  public onSubmit() {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      this.api.post(this.apiCreate, this.formGroup.value).subscribe(res => {
        if (res) {
          this.isVisible = false;
          const tag: Options = {
            value: res?.thanhPhanKey,
            label: res?.thanhPhanDisplay
          };
          this.thanhPhan.emit(tag);
        }
      }, err => this.api.errorMessage(err));
    }
  }
}

