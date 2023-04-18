
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { AuthService, UserModel } from '../../auth';
import { ActivatedRoute } from '@angular/router'
import { ApiService } from 'src/app/_metronic/shared/http/api.service';

interface IInfoNhanVien {
  hoTen: string,
  emailCongTy: string,
  tenChucVu: string,
  tenPhongBan: string,
  soMayLe: string,
  diaChiCuTru: string,
  soDienThoai: string,
  anhDaiDien: string
}

@Component({
  selector: 'app-personal-information',
  templateUrl: './personal-information.component.html',
  styleUrls: ['./personal-information.component.scss']
})
export class PersonalInformationComponent implements OnInit {

  formGroup: FormGroup;
  user: UserModel;
  firstUserState: UserModel;
  subscriptions: Subscription[] = [];
  avatarPic = 'none';
  isLoading$: Observable<boolean>;

  public InfoNhanVien: IInfoNhanVien = {
    hoTen: "",
    emailCongTy: "",
    tenChucVu: "",
    diaChiCuTru: "",
    soDienThoai: "",
    tenPhongBan: "",
    soMayLe: "",
    anhDaiDien: ""
  };

  public step = 1;

  constructor(
    private userService: AuthService,
    private fb: FormBuilder,
    private activatedroute: ActivatedRoute,
    public api: ApiService,
    private cdf: ChangeDetectorRef,
  ) {
    this.isLoading$ = this.userService.isLoadingSubject.asObservable();
    this.activatedroute.params.subscribe(data => {
      this.getInfoNhanVien(data.id);
    })
  }

  ngOnInit(): void {
    const sb = this.userService.currentUserSubject.asObservable().pipe(
      first(user => !!user)
    ).subscribe(user => {
      this.user = Object.assign({}, user);
      this.firstUserState = Object.assign({}, user);
      this.loadForm();
    });
    this.subscriptions.push(sb);
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }


  loadForm() {
    this.formGroup = this.fb.group({
      pic: [this.user.pic],
      firstname: [this.user.firstname, Validators.required],
      lastname: [this.user.lastname, Validators.required],
      companyName: [this.user.companyName, Validators.required],
      phone: [this.user.phone, Validators.required],
      email: [this.user.email, Validators.compose([Validators.required, Validators.email])],
      website: [this.user.website, Validators.required]
    });
  }

  public getInfoNhanVien(Id) {
    const query = {
      nguoiDungId: Id,
    }
    this.api.get('/api/danhba-detail', query)
      .subscribe((res: any) => {
        if (res) {
          this.InfoNhanVien = res;
          this.cdf.detectChanges();
        }
      })
  }

  save() {
    this.formGroup.markAllAsTouched();
    if (!this.formGroup.valid) {
      return;
    }

    const formValues = this.formGroup.value;
    this.user = Object.assign(this.user, formValues);

    // Do request to your server for user update, we just imitate user update there
    this.userService.isLoadingSubject.next(true);
    setTimeout(() => {
      this.userService.currentUserSubject.next(Object.assign({}, this.user));
      this.userService.isLoadingSubject.next(false);
    }, 2000);
  }

  cancel() {
    this.user = Object.assign({}, this.firstUserState);
    this.loadForm();
  }

  getPic() {
    if (!this.user.pic) {
      return 'none';
    }
    return `url('${this.user.pic}')`;
  }

  deletePic() {
    this.user.pic = '';
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
}
