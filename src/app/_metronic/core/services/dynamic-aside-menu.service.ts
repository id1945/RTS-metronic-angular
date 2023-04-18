
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ApiService } from './../../shared/http/api.service';
import { firstAndLastDayOfMonth } from './../../shared/shared/common/helper';
import { DynamicAsideMenuConfig } from '../../configs/dynamic-aside-menu.config';
import { orderBy } from 'lodash-es';
import { DatePipe } from '@angular/common';

const emptyMenuConfig = {
  items: []
};

export interface MyJob {
  thanhToanTamUng: number;
  toTrinh: number;
  yeuCauMuaHang: number;
  nhanSu: number;
  pheDuyetKhac: number;
  congViec: number;
  xeDuaDon: number;
  chuyenPhatNhanh: number;
  hoSoVanPhongPham: number;
}

interface Badges {
  pathParent: string;
  pathChildren1: string;
  pathChildren2: string;
  count: number;
  total1: number; // Hiển thị badges tổng ngoài cùng
  total2: number; // Hiển thị badges tổng cấp thứ nhất
}

@Injectable({
  providedIn: 'root'
})
export class DynamicAsideMenuService {

  private menuConfigSubject = new BehaviorSubject<any>(emptyMenuConfig);
  public menuConfig$: Observable<any>;
  public menuPermission$ = new BehaviorSubject(null);
  public menuConfig = { ...DynamicAsideMenuConfig } as any;
  // Tổng mua hàng
  public totalMuaHang$ = new BehaviorSubject(0);
  // Tổng tờ trình
  public choToiPheDuyet$ = new BehaviorSubject<MyJob>(null);
  public totalToTrinh$ = new BehaviorSubject(0);
  // Tổng nhân viên
  public totalNhanVien$ = new BehaviorSubject(0);
  // Tổng hành chính
  public totalHanhChinh$ = new BehaviorSubject(0);

  constructor(
    private api: ApiService,
    private datepipe: DatePipe,
  ) {
    this.menuConfig$ = this.menuConfigSubject.asObservable();
  }

  public async loadPermissions() {
    // Request API
    this.api.loadingCustomOn();
    return await this.api.get('/api/menu').toPromise().then((data) => {
      const menu_permisson = [...data?.menuItems]?.map(m => ([m?.children]))?.flat(2)?.map(m => ({ controller: m?.controller, screenKey: m?.tenChucNang, action: m?.action, thuTuSapXep: m?.thuTuSapXep }));
      this.menuPermission$.next(menu_permisson);
      // Sort asc
      of(this.sorted(menu_permisson)).toPromise().then(res => {
        // Set init config.
        this.menuConfigSubject.next(res);
        // Load badges
        this.loadBadgesMuaHang();
        this.loadBadgesMyJobInHomePage();
        this.loadBadgesNhanVien();
        this.api.loadingCustomOff();
      });
    }).catch(err => {
      this.api.loadingCustomOff();
      this.api.errorMessage(err);
    });
  }

  /**
   * Sắp xếp theo thứ tự của data BE trả về
   * @param menu_permisson 
   * @param order 
   * @returns 
   */
  private sorted(menu_permisson, order = 'asc') {
    return {
      items: this.menuConfig?.items?.map(m0 => {
        if (m0.hasOwnProperty('submenu')) {
          return {
            ...m0, submenu: orderBy(m0?.submenu?.map(m1 => ({ ...m1, thuTuSapXep: menu_permisson?.find(f1 => f1?.controller === m1?.screenKey) })), 'thuTuSapXep', order)
          }
        } else {
          return m0;
        }
      })
    };
  }

  /**
   * Chờ phê duyệt
   * Badges Mua hàng
   */
  public loadBadgesMuaHang() {
    // Reset
    this.totalMuaHang$.next(0);

    // Danh sách Yêu cầu mua sắm
    this.api.get('/api/purchase-product-list/cho-toi-phe-duyet').subscribe(res => {
      if (res) {
        const count = res?.count ?? 0;
        this.totalMuaHang$.next(count + this.totalMuaHang$.value);
        this.updateBadges({
          pathParent: '/purchase',
          pathChildren1: '/purchase/list',
          pathChildren2: null,
          count: count,
          total1: this.totalMuaHang$.value,
          total2: 0
        });
      }
    });

    // Đề xuất lựa chọn nhà cung cấp
    this.api.get('/api/purchase-requisition-list/cho-toi-phe-duyet').subscribe(res => {
      if (res) {
        const count = res?.count ?? 0;
        this.totalMuaHang$.next(count + this.totalMuaHang$.value);
        this.updateBadges({
          pathParent: '/purchase',
          pathChildren1: '/purchase/supplier-selection',
          pathChildren2: null,
          count: count,
          total1: this.totalMuaHang$.value,
          total2: 0
        });
      }
    });

    // Đề nghị ký hợp đồng
    this.api.get('/api/purchase-contract-list/cho-toi-phe-duyet').subscribe(res => {
      if (res) {
        const count = res?.count ?? 0;
        this.totalMuaHang$.next(count + this.totalMuaHang$.value);
        this.updateBadges({
          pathParent: '/purchase',
          pathChildren1: '/purchase/contract',
          pathChildren2: null,
          count: count,
          total1: this.totalMuaHang$.value,
          total2: 0
        });
      }
    });
  }

  /**
   * Chờ phê duyệt
   * Badges tờ trình
   */
  public loadBadgesMyJobInHomePage() {
    // Danh sách Yêu cầu mua sắm
    this.api.get('/api/trangchu/cho-toi-phe-duyet').subscribe((res: MyJob) => {
      if (res) {
        // Event bus data cho màn hình Thông tin cá nhân
        this.choToiPheDuyet$.next(res);
        // Tờ trình
        this.totalToTrinh$.next((res?.toTrinh ?? 0) + (res?.thanhToanTamUng ?? 0));
        this.updateBadges({
          pathParent: '/submissions',
          pathChildren1: '/submissions/list',
          pathChildren2: null,
          count: res?.toTrinh ?? 0,
          total1: this.totalToTrinh$.value,
          total2: 0
        });
        this.updateBadges({
          pathParent: '/submissions',
          pathChildren1: '/submissions/requests-payment',
          pathChildren2: null,
          count: res?.thanhToanTamUng ?? 0,
          total1: this.totalToTrinh$.value,
          total2: 0
        });
        // Hành chính
        this.totalHanhChinh$.next((res?.xeDuaDon ?? 0) + (res?.chuyenPhatNhanh ?? 0) + (res?.hoSoVanPhongPham ?? 0));
        this.updateBadges({
          pathParent: '/administration',
          pathChildren1: '/administration/registervehicle',
          pathChildren2: null,
          count: res?.xeDuaDon ?? 0,
          total1: this.totalHanhChinh$.value,
          total2: 0,
        });
        this.updateBadges({
          pathParent: '/administration',
          pathChildren1: '/administration/delivery',
          pathChildren2: null,
          count: res?.chuyenPhatNhanh ?? 0,
          total1: this.totalHanhChinh$.value,
          total2: 0,
        });
        this.updateBadges({
          pathParent: '/administration',
          pathChildren1: '/administration/stationery',
          pathChildren2: null,
          count: res?.hoSoVanPhongPham ?? 0,
          total1: this.totalHanhChinh$.value,
          total2: 0,
        });
      }
    });
  }

  /**
   * Chờ phê duyệt
   * Badges nhân viên
   */
  public loadBadgesNhanVien() {
    const HEADER_ACCEPT = { headers: { 'Accept': 'application/json' } };
    // Reset
    this.totalNhanVien$.next(0);
    // Status: 0,1: Đăng ký chưa duyệt
    const paginator = {
      Type: '-1',
      KeyEmployee: '',
      FromDate: this.datepipe.transform(firstAndLastDayOfMonth(new Date().getFullYear().toString(), (new Date().getMonth() + 1).toString()).firstDate, 'yyyy-MM-dd'),
      ToDate: this.datepipe.transform(firstAndLastDayOfMonth(new Date().getFullYear().toString(), (new Date().getMonth() + 2).toString()).lastDate, 'yyyy-MM-dd')
    };
    const bodyParams = {
      ...paginator,
      Status: '1',
      Page: 1,
      PageSize: 99
    };
    // Call
    // Phê duyệt nghỉ
    this.api.post('/API/Mobile/SearchApprovedLeave', bodyParams, HEADER_ACCEPT).subscribe(res => {
      if (res?.ResponseStatus === 1) {
        const count = res?.Count ?? 0;
        this.totalNhanVien$.next(count + this.totalNhanVien$.value);
        this.updateBadges({
          pathParent: '/personnel',
          pathChildren1: 'register',
          pathChildren2: '/personnel/approve/holiday',
          count: count,
          total1: this.totalNhanVien$.value,
          total2: this.totalNhanVien$.value,
        });
      }
    });
    // Phê duyệt làm thêm
    this.api.post('/API/Mobile/SearchApprovedOT', bodyParams, HEADER_ACCEPT).subscribe(res => {
      if (res?.ResponseStatus === 1) {
        const count = res?.Count ?? 0;
        this.totalNhanVien$.next(count + this.totalNhanVien$.value);
        this.updateBadges({
          pathParent: '/personnel',
          pathChildren1: 'register',
          pathChildren2: '/personnel/approve/overtime',
          count: count,
          total1: this.totalNhanVien$.value,
          total2: this.totalNhanVien$.value,
        });
      }
    });
    // Phê duyệt đăng ký nghỉ không lương dưới nửa ngày
    this.api.post('/API/Mobile/SearchApprovedWLEO', bodyParams, HEADER_ACCEPT).subscribe(res => {
      if (res?.ResponseStatus === 1) {
        const count = res?.Count ?? 0;
        this.totalNhanVien$.next(count + this.totalNhanVien$.value);
        this.updateBadges({
          pathParent: '/personnel',
          pathChildren1: 'register',
          pathChildren2: '/personnel/approve/wleo',
          count: count,
          total1: this.totalNhanVien$.value,
          total2: this.totalNhanVien$.value,
        });
      }
    });
    // Phê duyệt giải trình công
    this.api.post('/API/Mobile/SearchApprovedExplain', bodyParams, HEADER_ACCEPT).subscribe(res => {
      if (res?.ResponseStatus === 1) {
        const count = res?.Count ?? 0;
        this.totalNhanVien$.next(count + this.totalNhanVien$.value);
        this.updateBadges({
          pathParent: '/personnel',
          pathChildren1: 'register',
          pathChildren2: '/personnel/approve/work-explanation',
          count: count,
          total1: this.totalNhanVien$.value,
          total2: this.totalNhanVien$.value,
        });
      }
    });
  }

  // Update data config menu and show badges
  private updateBadges(data: Badges) {
    // Append 
    this.menuConfigSubject.next({
      items: this.menuConfigSubject?.value?.items?.map(m => (m?.page === data.pathParent) ? ({
        ...m, submenu: m.submenu?.map(m1 => (m1.page === data.pathChildren1) ? (data.pathChildren2 ? ({
          ...m1,
          submenu: m1?.submenu?.map(m2 => (m2.page === data.pathChildren2) ? ({ ...m2, badges: data.count }) : (m2)),
          totalBadges2: data.total2,
        }) : { ...m1, badges: data.count }) : (m1)), totalBadges: data.total1,
      }) : m)
    });
  }
}