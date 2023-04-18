import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import { DynamicAsideMenuService } from 'src/app/_metronic/core';
import { AuthService, UserModel } from 'src/app/modules/auth';

interface IChoToiPheDuyet {
  thanhToanTamUng: number;
  toTrinh: number;
  yeuCauMuaHang: number;
  nhanSu: number;
  pheDuyetKhac: number;
  congViec: number;
}

type Menu = 'user_info' | 'signature';

@Component({
  selector: 'app-profile-overview',
  templateUrl: './profile-overview.component.html',
  styleUrls: ['./profile-overview.component.scss']
})
export class ProfileOverviewComponent {

  public infoNhanVien: UserModel;
  public choToiPheDuyet: IChoToiPheDuyet;
  public menuKey: Menu = 'user_info';

  constructor(
    public api: ApiService,
    private userService: AuthService,
    public translate: TranslateService,
    public asideMenu: DynamicAsideMenuService,
  ) {
    // Load data
    this.getChoToiPheDuyet();
    this.infoNhanVien = this.userService.currentUserValue;
  }

  public getChoToiPheDuyet() {
    this.api.get('/api/trangchu/cho-toi-phe-duyet').subscribe((res: any) => {
      if (res) {
        this.choToiPheDuyet = res;
      }
    })
  }
}
