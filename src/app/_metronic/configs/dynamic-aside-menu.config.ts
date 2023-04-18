export const DynamicAsideMenuConfig = {
  items: [
    {
      title: 'MENU.HOME',
      root: true,
      bullet: 'dot',
      icon: 'flaticon2-user-outline-symbol',
      svg: './assets/media/svg/icons/Home/Home.svg',
      screenKey: 'allow',
      page: '/',
    },
    // {
    //   title: 'MENU.HEALTH_DECLARATION',
    //   root: true,
    //   bullet: 'dot',
    //   icon: 'flaticon2-user-outline-symbol',
    //   svg: './assets/media/svg/icons/Devices/Diagnostics.svg',
    //   screenKey: 'allow',
    //   page: '/health/declaration',
    // },
    {
      title: 'MENU.USER_INFOR',
      root: true,
      bullet: 'dot',
      icon: 'flaticon2-user-outline-symbol',
      svg: './assets/media/svg/icons/General/User.svg',
      screenKey: 'allow',
      page: '/user-profile',
    },
    {
      title: 'MENU.HTC.INFOR',
      bullet: 'dot',
      icon: 'flaticon2-list-2',
      svg: './assets/media/svg/icons/Layout/Layout-4-blocks.svg',
      root: true,
      page: '/contacts',
      submenu: [
        {
          title: 'MENU.HTC.INTRODUCE',
          page: '/contacts/intro',
          screenKey: 'Introduction',
        },
        {
          title: 'MENU.HTC.CONTACTS',
          page: '/contacts/list',
          screenKey: 'DanhBaHTC',
        },
      ]
    },
    {
      title: 'MENU.DOCUMENT.DOCUMENT',
      bullet: 'dot',
      icon: 'flaticon2-list-2',
      svg: './assets/media/svg/icons/General/Settings-1.svg',
      root: true,
      page: '/documents',
      submenu: [
        {
          title: 'MENU.DOCUMENT.INSTITUTIONAL_DOCUMENTS',
          page: '/documents/regime',
          screenKey: 'VanBanDinhChe',
        },
        {
          title: 'MENU.DOCUMENT.INSTITUTIONAL_PROPOSE',
          page: '/documents/regime-propose',
          screenKey: 'allow',
          // screenKey: 'Trình duyệt văn bản định chế',
        },
        {
          title: 'Lấy số văn bản',
          page: '/documents/numberdocs',
          screenKey: 'allow',
          // screenKey: 'Lấy số văn bản',
        },
        {
          title: 'MENU.DOCUMENT.LAW_LIBRARY',
          page: '/documents/librarylaw',
          screenKey: 'ThuVienPhapLuat',
        },
        {
          title: 'Báo cáo nội bộ',
          page: '/documents/internalreport',
          screenKey: 'BaoCaoNoiBo',
        },
        {
          title: 'Chính sách đại lý',
          page: '/documents/agencypolicy',
          screenKey: 'ChinhSachDaiLy',
        }
      ]
    },
    {
      title: 'MENU.REPORT.REPORT',
      root: true,
      bullet: 'dot',
      icon: 'flaticon2-user-outline-symbol',
      svg: './assets/media/svg/icons/Layout/Layout-top-panel-3.svg',
      page: '/submissions',
      submenu: [
        {
          title: 'MENU.REPORT.EXPENSE_REPORT',
          page: '/submissions/list',
          screenKey: 'ToTrinh'
        },
        {
          title: 'MENU.REPORT.REQUESTS_PAYMENT',
          page: '/submissions/requests-payment',
          screenKey: 'DeNghiThanhToanDaiLy'
        },
        {
          title: 'MENU.REPORT.PROMULGATE',
          page: '/submissions/promulgate',
          screenKey: 'BanHanh'
        },
      ]
    },
    {
      title: 'MENU.PURCHASE.PURCHASE',
      root: true,
      bullet: 'dot',
      icon: 'flaticon2-user-outline-symbol',
      svg: './assets/media/svg/icons/Layout/Layout-left-panel-2.svg',
      page: '/purchase',
      submenu: [
        {
          title: 'MENU.PURCHASE.REQUEST',
          page: '/purchase/list',
          screenKey: 'Purchase'
        },
        {
          title: 'MENU.REPORT.SUPPLIER_SELECTION',
          page: '/purchase/supplier-selection',
          screenKey: 'allow',
          // screenKey: 'Đề xuất lựa chọn NCC',
        },
        {
          title: 'MENU.REPORT.SIGN_CONTRACT',
          page: '/purchase/contract',
          screenKey: 'Contract'
        },
      ]
    },
    {
      title: 'MENU.ADMINISTRATION.ADMINISTRATION',
      bullet: 'dot',
      icon: 'flaticon2-list-2',
      svg: './assets/media/svg/icons/Communication/Dial-numbers.svg',
      root: true,
      page: '/administration',
      submenu: [
        {
          title: 'MENU.ADMINISTRATION.STATIONERY',
          page: '/administration/stationery',
          screenKey: 'VanPhongPham'
        },
        {
          title: 'MENU.ADMINISTRATION.DELIVEREXPRESS',
          page: '/administration/delivery',
          screenKey: 'DangKyChuyenPhatNhanh'
        },
        {
          title: 'MENU.ADMINISTRATION.MYPARCEL',
          page: '/administration/parcel',
          screenKey: 'allow'
          // screenKey: 'Bưu phẩm của tôi',
        }
        ,
        {
          title: 'MENU.ADMINISTRATION.IMPORTPARCEL',
          page: '/administration/importparcel',
          screenKey: 'allow'
          // screenKey: 'Cập nhật bưu phẩm',
        }
        ,
        {
          title: 'MENU.ADMINISTRATION.REGISTERVEHICLE',
          page: '/administration/registervehicle',
          screenKey: 'XeDuaDon'
        },
        {
          title: 'Danh sách chuyến đi',
          page: '/administration/bussinesstrip',
          screenKey: 'DanhSachChuyenDi'
        },
        {
          title: 'Cắt cơm trưa',
          page: '/administration/skip-lunch',
          screenKey: 'DangKyCatCom'
        }
      ]
    },
    {
      title: 'MENU.USER_PERSONNEL.USER_PERSONNEL',
      bullet: 'dot',
      icon: 'flaticon2-list-2',
      svg: './assets/media/svg/icons/Communication/Add-user.svg',
      root: true,
      page: '/personnel',
      submenu: [
        {
          title: 'MENU.USER_PERSONNEL.MONTH_PLAN',
          page: '/personnel/month-plan',
          screenKey: 'KeHoachCongTac'
        },
        {
          title: 'MENU.USER_PERSONNEL.MISION_PLAN',
          page: '/personnel/mission',
          screenKey: 'DieuDongCongTac'
        },
        {
          title: 'Nghỉ/ Làm thêm',
          bullet: 'dot',
          page: 'register',
          submenu: [
            {
              title: 'Đăng ký nghỉ',
              page: '/personnel/register/holiday',
              screenKey: 'allow',
              // screenKey: 'Đăng ký nghỉ',
            },
            {
              title: 'Đăng ký đi làm thêm',
              page: '/personnel/register/overtime',
              screenKey: 'allow',
              // screenKey: 'Đăng ký đi làm thêm',
            },
            {
              title: 'Đăng ký nghỉ không lương dưới nửa ngày',
              page: '/personnel/register/wleo',
              screenKey: 'allow',
              // screenKey: 'Đăng ký nghỉ không lương dưới nửa ngày',
            },
            {
              title: 'Giải trình công',
              page: '/personnel/explanation',
              screenKey: 'allow',
              // screenKey: 'Giải trình công',
            },
            {
              title: 'Phê duyệt nghỉ',
              page: '/personnel/approve/holiday',
              screenKey: 'allow',
              // screenKey: 'Phê duyệt nghỉ',
            },
            {
              title: 'Phê duyệt làm thêm',
              page: '/personnel/approve/overtime',
              screenKey: 'allow',
              // screenKey: 'Phê duyệt làm thêm',
            },
            {
              title: 'Phê duyệt đăng ký nghỉ không lương dưới nửa ngày',
              page: '/personnel/approve/wleo',
              screenKey: 'allow',
              // screenKey: 'Phê duyệt đăng ký nghỉ không lương dưới nửa ngày',
            },
            {
              title: 'Phê duyệt giải trình công',
              page: '/personnel/approve/work-explanation',
              screenKey: 'allow',
              // screenKey: 'Phê duyệt giải trình công',
            }
          ]
        },
        {
          title: 'Bảng công chi tiết',
          page: '/personnel/timesheet',
          screenKey: 'allow',
          // screenKey: 'Bảng công chi tiết',
        },
        {
          title: 'Phiếu lương',
          page: '/personnel/salary',
          screenKey: 'allow',
          // screenKey: 'Phiếu lương',
        },
      ]
    },
    {
      title: 'KPI bộ phận',
      bullet: 'dot',
      icon: 'flaticon2-list-2',
      svg: './assets/media/svg/icons/Shopping/Chart-bar2.svg',
      root: true,
      page: '/KPI',
      submenu: [
        {
          title: 'Kết quả KPI',
          page: '/KPI/kpi',
          screenKey: 'KPIQuy',
        },
        {
          title: 'Cập nhật KPI',
          page: '/KPI/update-kpi-detail',
          screenKey: 'KPIQUYCHITIET',
        },
        {
          title: 'Danh sách KPI mục tiêu',
          page: '/KPI/target-kpi',
          screenKey: 'KPIMucTieu',
        },
        {
          title: 'Báo cáo - Thống kê',
          page: '/KPI/target-report',
          screenKey: 'KPIQuy',
        },
        {
          title: 'Danh sách Nhóm tiêu chí',
          page: '/KPI/criterion-kpi',
          screenKey: 'KPINhomTieuChi',
        },
        {
          title: 'Danh sách Mục tiêu - KHCV - KPI Bộ phận',
          page: '/KPI/target-kpi-parts',
          screenKey: 'KPIMucTieuNamBoPhan',
        },
        {
          title: 'Danh sách Thư viện KPI Bộ phận',
          page: '/KPI/library-kpi',
          screenKey: 'KPIMucTieu',
        }
      ]
    },
    {
      title: 'MENU.MANAGEMENT.MANAGEMENT',
      bullet: 'dot',
      icon: 'flaticon2-list-2',
      svg: './assets/media/svg/icons/Shopping/Safe.svg',
      root: true,
      page: '/management',
      submenu: [
        {
          title: 'MENU.MANAGEMENT.NEWS',
          page: '/management/posts',
          screenKey: 'BaiViet',
        },
        {
          title: 'Thư viện ảnh',
          page: '/management/post-library',
          screenKey: 'ThuVienAnhCongTy',
        },
        {
          title: 'Thư viện video',
          page: '/management/video-library',
          screenKey: 'ThuVienVideoCongTy',
        },
        {
          title: 'Tài liệu công ty',
          page: '/management/documents',
          screenKey: 'TaiLieu',
        },
        {
          title: 'Người dùng',
          page: '/management/users',
          screenKey: 'NguoiDung',
        },
        {
          title: 'Nhóm người dùng',
          page: '/management/groups',
          screenKey: 'NhomNguoiDung',
        },
        {
          title: 'Quy trình',
          page: '/management/flows',
          screenKey: 'QuyTrinh',
        },
        {
          title: 'Viber message',
          page: '/management/vibers',
          screenKey: 'ViberMessage',
        },
        {
          title: 'Popup nội dung',
          page: '/management/popup',
          screenKey: 'Popup',
        }
      ]
    },
    {
      title: 'Danh mục',
      bullet: 'dot',
      icon: 'flaticon2-list-2',
      svg: './assets/media/svg/icons/Layout/Layout-arrange.svg',
      root: true,
      page: '/category',
      submenu: [
        {
          title: 'Chức vụ',
          page: '/category/positions',
          screenKey: 'ChucVu',
        },
        {
          title: 'Đơn vị tính',
          page: '/category/units',
          screenKey: 'DonViTinh',
        },
        {
          title: 'Loại nghiệp vụ',
          page: '/category/bussinesstypes',
          screenKey: 'LoaiNghiepVu',
        },
        {
          title: 'Nhóm sản phẩm',
          page: '/category/producttypes',
          screenKey: 'NhomSanPham',
        },
        {
          title: 'Nhóm bài viết',
          page: '/category/newstypes',
          screenKey: 'NhomBaiViet',
        },
        {
          title: 'Phòng ban',
          page: '/category/departments',
          screenKey: 'PhongBan',
        },
        {
          title: 'Phòng họp',
          page: '/category/meetingrooms',
          screenKey: 'PhongHop',
        },
        {
          title: 'Quận huyện',
          page: '/category/districts',
          screenKey: 'QuanHuyen',
        },
        {
          title: 'Tỉnh thành',
          page: '/category/provinces',
          screenKey: 'TinhThanh',
        },
        {
          title: 'Danh sách xe',
          page: '/category/vehicles',
          screenKey: 'DanhSachXes',
        },
        {
          title: 'Danh sách lái xe',
          page: '/category/drivers',
          screenKey: 'DanhSachTaiXes',
        },
      ]
    },
    {
      title: 'MENU.CALENDAR.CALENDAR',
      root: true,
      bullet: 'dot',
      icon: 'flaticon2-user-outline-symbol',
      svg: './assets/media/svg/icons/Layout/Layout-left-panel-1.svg',
      page: '/meeting',
      submenu: [
        {
          title: 'MENU.CALENDAR.CALENDAR',
          page: '/meeting/schedule',
          screenKey: 'allow',
          // screenKey: 'Lịch làm việc',
        }
      ]
    },
    // {
    //   title: 'MENU.USER_MANUAL',
    //   root: true,
    //   bullet: 'dot',
    //   icon: 'flaticon2-user-outline-symbol',
    //   svg: './assets/media/svg/icons/Weather/Sun-fog.svg',
    //   page: '/guide',
    //   submenu: [
    //     {
    //       isHref: true,
    //       title: 'Hướng dẫn sử dụng',
    //       page: '/guide/index.html',
    //       screenKey: 'allow',
    //     }
    //   ]
    // }
    {
      title: 'Hỗ trợ CNTT',
      root: true,
      bullet: 'dot',
      icon: 'flaticon2-user-outline-symbol',
      svg: './assets/media/svg/icons/Layout/Layout-grid.svg',
      page: '/guide',
      submenu: [
        {
          title: 'Danh sách yêu cầu hỗ trợ',
          page: '/it-request/list',
          screenKey: 'allow',
          // screenKey: 'Hỗ trợ CNTT',
        }
      ]
    }
  ]
};