import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SelectedFiles } from '../../services/files.service';

@Component({
  selector: 'app-confirm-input-file',
  templateUrl: './confirm-input-file.component.html',
  styleUrls: ['./confirm-input-file.component.scss'],
  exportAs: 'confirm-input-file'
})
export class ConfirmInputFileComponent {

  // Title
  @Input() title: string;
  @Input() confirm: string;
  // Content
  @Input() lableContent = '';
  @Input() requiredContent = false;
  @Input() msgContent = '';

  // File
  @Input() lableFile = 'Tài liệu đính kèm';
  @Input() lableFileBtn = 'Tải tài liệu lên';
  @Input() requiredFile = false;
  @Input() isMultiple = true;
  @Input() msgFile = 'Tài liệu đính kèm là bắt buộc';
  public selectedFiles: SelectedFiles[] = [];

  // Event output
  @Output() submit = new EventEmitter();

  public meta: any;
  public isVisible = false;
  public formGroup: FormGroup;

  constructor() {
    this.initForm();
  }

  public initForm(): void {
    if (this.requiredContent) {
      this.formGroup = new FormGroup({ content: new FormControl() });
    } else {
      this.formGroup = new FormGroup({ content: new FormControl('', Validators.required) });
    }
  }

  get f() { return this.formGroup.controls; }

  public showModal(content = '', meta = null) {
    this.isVisible = true;
    this.initForm();
    this.formGroup.patchValue({ content: content });
    this.meta = meta;
  }

  public onSubmit() {
    if (this.requiredContent) {
      this.formGroup.markAllAsTouched();
      if (this.formGroup.valid) {
        this.submit.emit({
          meta: this.meta,
          content: this.formGroup.controls.content.value,
          selectedFiles: this.selectedFiles
        });
      }
    } else {
      this.submit.emit({
        meta: this.meta,
        content: this.formGroup.controls.content.value,
        selectedFiles: this.selectedFiles
      });
    }
  }
}
