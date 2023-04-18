import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-contact-modal',
  templateUrl: './edit-contact-modal.component.html',
  styleUrls: ['./edit-contact-modal.component.scss']
})
export class EditContactModalComponent implements OnInit {
  @Input() id: number;
  isLoading$;
  public customer: any;
  formGroup: FormGroup;
  private subscriptions: Subscription[] = [];
  constructor(
    private fb: FormBuilder, public modal: NgbActiveModal
    ) { }

  ngOnInit(): void {
    this.loadCustomer();
  }

  loadCustomer() {
    if (!this.id) {
      this.loadForm();
    } else {

    }
  }

  loadForm() {
    this.formGroup = this.fb.group({
      firstName: [this.customer?.firstName, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      lastName: [this.customer?.lastName, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      email: [this.customer?.email, Validators.compose([Validators.required, Validators.email])],
      dob: [this.customer?.dateOfBbirth, Validators.compose([Validators.nullValidator])],
      userName: [this.customer?.userName, Validators.compose([Validators.required])],
      gender: [this.customer?.gender, Validators.compose([Validators.required])],
      ipAddress: [this.customer?.ipAddress],
      type: [this.customer?.type, Validators.compose([Validators.required])]
    });
  }

  save() {
    this.prepareCustomer();
    if (this.customer?.id) {
      this.edit();
    } else {
      this.create();
    }
  }

  edit() {
  }

  create() {
  }

  private prepareCustomer() {
    const formData = this.formGroup.value;
    this.customer.dob = new Date(formData.dob);
    this.customer.email = formData.email;
    this.customer.firstName = formData.firstName;
    this.customer.dateOfBbirth = formData.dob;
    this.customer.ipAddress = formData.ipAddress;
    this.customer.lastName = formData.lastName;
    this.customer.type = +formData.type;
    this.customer.userName = formData.userName;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  // helpers for View
  isControlValid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasError(validation, controlName): boolean {
    const control = this.formGroup.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouched(controlName): boolean {
    const control = this.formGroup.controls[controlName];
    return control.dirty || control.touched;
  }
}
