import { FormGroup, FormControl } from '@angular/forms';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-confirm-input-basic',
  templateUrl: './confirm-input-basic.component.html',
  styleUrls: ['./confirm-input-basic.component.scss'],
  exportAs: 'confirm-input-basic'
})
export class ConfirmInputBasicComponent {

  @Input() title: string;
  @Input() lable: string;
  @Input() confirm: string;
  @Output() submit = new EventEmitter();

  public meta: any;
  public isVisible = false;
  public formGroup: FormGroup;

  constructor() {
    this.initForm();
  }

  initForm(): void {
    this.formGroup = new FormGroup({
      content: new FormControl()
    })
  }

  public showModal(content: string, meta: any) {
    this.isVisible = true;
    this.initForm();
    this.formGroup.patchValue({ content: content });
    this.meta = meta;
  }

  public onSubmit() {
    this.submit.emit({
      meta: this.meta,
      content: this.formGroup.controls.content.value
    });
  }
}
