import { AuthService } from 'src/app/modules/auth';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import swal from 'sweetalert';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  exportAs: 'change-password'
})
export class ChangePasswordComponent implements OnInit {

  public isVisible = false;
  public passwordVisible = false;
  public formGroup: FormGroup;

  // Ouput
  @Output() onEvent = new EventEmitter();

  constructor(
    public api: ApiService,
    public auth: AuthService,
    public translate: TranslateService,
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  public showModal() {
    this.isVisible = true;
    this.initForm();
  }

  public initForm() {
    this.formGroup = new FormGroup({
      currentPassword: new FormControl('', Validators.required),
      newPassword: new FormControl('', [
        Validators.required,
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/)
      ]),
      newPasswordVerify: new FormControl('', Validators.required),
    }, this.matchPassword);
  }

  private matchPassword(AC: AbstractControl) {
    let newPassword = AC.get('newPassword').value;
    if (AC.get('newPasswordVerify').touched || AC.get('newPasswordVerify').dirty) {
      let verifyPassword = AC.get('newPasswordVerify').value;
      if (newPassword != verifyPassword) {
        AC.get('newPasswordVerify').setErrors({ matchPassword: true })
      } else {
        return null
      }
    }
  }

  get f() { return this.formGroup.controls; }

  public onSubmit() {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      const body = {
        username: this.auth.currentUserValue.username,
        ...this.formGroup.value,
      }
      this.api.post('/api/UserInfo/change-password', body).subscribe(res => {
        if (res?.isSuccess) {
          swal({
            icon: "success",
            title: "Thay đổi mật khẩu thành công, Vui lòng đăng nhập lại.",
            buttons: {
              ok: this.translate.instant('COMMON.btn.close'),
            },
          } as any).then(() => {
            this.onEvent.emit(true);
            this.isVisible = false;
          })
        } else {
          this.api.errorMessage('Thay đổi mật khẩu không thành công!');
        }
      }, err => this.api.errorMessage(err))
    }
  }
}
