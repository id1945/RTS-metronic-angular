import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import swal from 'sweetalert';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  public passwordVisible = false;
  public formGroup: FormGroup;

  constructor(
    public api: ApiService,
    public translate: TranslateService,
  ) { }

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      currentPassword: new FormControl('', Validators.required),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[\d]{6,6}$/g)
      ]),
      confirmPassword: new FormControl('', Validators.required),
    }, this.matchPassword);
  }

  private matchPassword(AC: AbstractControl) {
    let password = AC.get('password').value;
    if (AC.get('confirmPassword').touched || AC.get('confirmPassword').dirty) {
      let verifyPassword = AC.get('confirmPassword').value;
      if (password != verifyPassword) {
        AC.get('confirmPassword').setErrors({ matchPassword: true })
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
        currentPassCode: this.f.currentPassword.value,
        newPassCode: this.f.password.value
      }
      this.api.put('/api/chukyso-update/password', body).subscribe(res => {
        if (res?.isSuccess) {
          swal({
            icon: "success",
            title: "Thay đổi mật khẩu thành công!",
            buttons: {
              ok: this.translate.instant('COMMON.btn.close'),
            },
          } as any)
        } else {
          this.api.errorMessage('Thay đổi mật khẩu không thành công!');
        }
      }, err => this.api.errorMessage(err))
    }
  }

  public onResetPassword() {
    swal("Xác nhật reset password?", {
      buttons: ["Huỷ bỏ", "Xác nhận"],
    }).then(ok => {
      ok && this.api.put('/api/chukyso-update/reset-password', null).subscribe(res => {
        if (res?.isSuccess) {
          swal({
            icon: "success",
            title: "Reset password thành công!",
            buttons: {
              ok: this.translate.instant('COMMON.btn.close'),
            },
          } as any)
        } else {
          this.api.errorMessage('Reset password không thành công!');
        }
      }, err => this.api.errorMessage(err));
    });
  }
}
