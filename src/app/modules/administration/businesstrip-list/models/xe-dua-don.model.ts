export interface XeDuaDon {
    hoSoId: number;
    nguoiDatHoTen: string;
    tenPhongBan: string;
    phuongTienDeXuatDisplay: string;
    hinhThucLaiXeDisplay: string;
    thoiGianDi: string;
    thoiGianVe: string;
    tinhThanhDisplay: string;
    quanHuyenDisplay: string;
    noiDungCongViec: string;
    chiTietHanhTrinh: string;
    khuVucId: number;
    ghiChu: string;
    tinhTrangHienTai: string;
    nguoiPheDuyet: string;
    isAllowPheDuyet: boolean;
    isTrongKeHoach: boolean;
    nguoiDi: {
        items: XeDuaDonNguoiDi[]
    },
    lichSuPheDuyet: {
        items: XeDuaDonLichSuPheDuyet[]
    }
}

export interface XeDuaDonNguoiDi {
    nguoiDiDepartmentDisplay?: string;
    nguoiDiEmployeeDisplay?: string;
    nguoiDiDepartmentKey?: string;
    nguoiDiEmployeeKey?: string;
    // Nguoi di khac
    nguoiDiDepartmentKhac?:string;
    nguoiDiEmployeeKhac?:string;
}

export interface XeDuaDonLichSuPheDuyet {
    nguoiDuyet: string;
    tenBuocThucHien: string;
    tenTrangThai: string;
    tinhTrangKey: string;
    tinhTrang: string;
    ngayDuyet: string;
    noiDung: string
}

export interface DetailChuyenDi {
    id: number;
    maChuyenDi : string;
    hoSoIdYeuCau: number;
    ngayTao: string;
    nguoiTaoHoTen :string;
    taiXeId: number;
    taiXeHoTen: string;
    taiXeSoDT: string;
    isTaiXeKhac: boolean;
    xeDonId: number;
    xeDonBienSo: string;
    xeDonTenXe: string;
    isXeKhac: boolean;
    thoiGianDon: string;
    diaChiDon: string;
    hinhThucDichVu: string;
    matKhauThanhToan: string;
    taiKhoanThanhToan: string;
    ghiChu: string;
    kmStart: string;
    kmEnd: string;
    veGuiXe:string;
    tinhThanh:string;
    quanHuyen:string;
    hanhTrinh:string;
    thoiGianDi: string;
    thoiGianVe: string;
    nguoiDis: any[];
    isTrongKeHoach: boolean;
    lichSuChuyenDis: DetailLichSu[],
    isChuyenDiNgoai: boolean;
    isAllowUpdateThongTin: boolean;
    isAllowUpdateLenXe: boolean;
    isAllowUpdateKetThuc: boolean;
    isAllowUpdateHuy: boolean;
    isAllowXacNhanHanhTrinh: boolean;
    isAllowDanhGia: boolean;
    IsExportExcel: boolean;
}

interface DetailLichSu {
    trangThai: string;
    thoiGian: string;
    nguoiCapNhat: string;
    kmStart: string;
    kmEnd: string;
    veGuiXe:string;
    lyDoHuy: string
}