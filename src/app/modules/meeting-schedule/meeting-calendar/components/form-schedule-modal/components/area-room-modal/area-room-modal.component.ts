import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Options } from 'src/app/_metronic/shared/shared/models/options';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';

interface RoomInfo {
  name: string;
  id: number;
}

@Component({
  selector: 'app-area-room-modal',
  templateUrl: './area-room-modal.component.html',
  styleUrls: ['./area-room-modal.component.scss'],
  exportAs: 'area-room'
})
export class AreaRoomModalComponent implements OnInit {

  @Input() formGroup: FormGroup;
  @Output() phongHopEmit = new EventEmitter<RoomInfo>();

  public isVisible = false;
  public fg: FormGroup;
  public khuVucOptions: Options[] = [];

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.initForm();
  }

  public initForm() {
    this.fg = new FormGroup({
      KhuVucKey: new FormControl(this?.formGroup?.controls?.KhuVucKey?.value ?? null, Validators.required),
      NoteForLeTan: new FormControl(this?.formGroup?.controls?.NoteForLeTan?.value ?? ''),
    })
  }

  get f() { return this.fg.controls; }

  public showModal() {
    this.isVisible = true;
    this.initForm();
    this.getPhongBan();
  }

  public onSubmit() {
    if (this.fg.invalid) {
      this.fg.markAllAsTouched();
      return false;
    }
    this.isVisible = false;
    // Set value form
    this.formGroup.patchValue({
      ...this.fg.value,
    });
    // Remove show room name
    this.phongHopEmit.emit(null);
  }

  public getPhongBan() {
    this.api.get('/api/lich-lam-viec-dm/khu-vuc')
      .pipe(switchMap(s => of(s?.items?.map((m: any) => ({ value: m.khuVucKey, label: m.khuVucDisplay })))))
      .subscribe((res: any) => {
        if (res) {
          this.khuVucOptions = res;
        }
      })
  }

}
