import { Columns, DataTable } from 'src/app/_metronic/shared/shared/models/dataTable';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-setting-column-modal',
  templateUrl: './setting-column-modal.component.html',
  styleUrls: ['./setting-column-modal.component.scss'],
  exportAs: 'setting'
})
export class SettingColumnModalComponent implements OnInit {

  public isVisible = false;

  @Input() dataTable: DataTable<any>;
  @Output() change = new EventEmitter<Columns>();

  constructor() { }

  ngOnInit(): void {
  }

  public showModal() {
    this.isVisible = true;
  }

  public onModelChange(e) {
    if (this.dataTable.hasOwnProperty('isActive')) {
      this.dataTable.isActive = e;
    }
    if (this.dataTable?.columns?.length) {
      this.dataTable.columns = this.dataTable?.columns?.map(m => ({ ...m, isActive: e }))
    }
    if (this.dataTable?.columns2?.length) {
      this.dataTable.columns2 = this.dataTable?.columns2?.map(m => ({ ...m, isActive: e }))
    }
  }

}
