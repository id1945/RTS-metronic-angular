export interface RequestsPayment {
    hoSoId: number;
    tenNguoiTao: string;
    soChungTu: string;
    tongTien: number;
    tongTienNgoaiTe: string;
    noiDung: string;
    tenNhaCungCap: string;
    tenBoPhan: string;
    tenTrangThai: string;
    dinhKem: {
        items: RequestsPaymentFiles[],
        urlDownloadAll: number;
    },
    ngayKetThuc: string;
    loaiThanhToan: string;
    soChungTuNoiBo: string;
    ngayThanhToan: string;
    isAllowPheDuyet: boolean;
}

export interface RequestsPaymentFiles {
    fileName: string;
    hoSoGiayToId: number;
    urlDownload: string;
    urlPreview: string;
}

export interface RequestsPaymentDetail {
    hoSoId: number;
    isThanhToanCuoi: boolean;
    soChungTu: string;
    ngayTao: number;
    tenNguoiTao: string;
    tenPhongBanNguoiTao: string;
    soHopDong: string;
    soPhuLucHopDong: string;
    maSoThue: string;
    tenNhaCungCap: string;
    soHoaDon: string;
    toTrinhId: number;
    tenToTrinh: string;
    idYCMH: number;
    maYCMH: string;
    loaiDeNghiDisplay: string;
    loaiHinhThanhToanDisplay: string;
    noiDungDeNghi: string;
    giaTriHopDong: number;
    ghiChu: string;
    ngoaiTeKey: string;
    soTaiKhoan: string;
    tenTaiKhoan: string;
    tenNganHang: string;
    tenChiNhanh: string;
    deNghiTamUngKey: string;
    deNghiTamUngDisplay: string;
    tongTienTamUng: number;
    hoanUngVN: number;
    hoanUngNT: number;
    chiThemVN: number;
    chiThemNT: number;
    isAllowPheDuyet: boolean;
    isAllowUpdateThanhToanUuTien: boolean;
    isAllowPrint: boolean;
    isAllowYeuCauBoSungChungTu: boolean;
    isAllowBoSungChungTu: boolean;
    lyDoYeuCauBoSungChungTu: string;
    phanHoiYeuCauBoSungChungTu: string;
    lichSuThanhToan: {
        items: [
            {
                hoSoId: number;
                soChungTu: string;
                phuLucHopDong: string;
                ngayThanhToan: string;
                tongTien: number;
                tongTienNgoaiTe: string;
                tenTrangThaiThanhToan: string
            }
        ]
    },
    dinhKem: {
        items: [
            {
                fileName: string;
                hoSoGiayToId: number;
            }
        ]
    },
    chiTietThanhToan: {
        items: [
            {
                noiDungChiTiet: string;
                maChiPhiKey: string;
                maCT: string;
                soTienCoCTVN: number;
                soTienCoCTNT: number;
                soTienKhongCTVN: number;
                soTienKhongCTNT: number;
                ghiChu: string;
                monthPay: number;
                yearPay: number;
            }
        ]
    },
    lichSuPheDuyet: {
        items: [
            {
                nguoiDuyet: string;
                tenBuocThucHien: string;
                tenTrangThai: string;
                tinhTrangKey: string;
                tinhTrang: string;
                ngayDuyet: string;
                noiDung: string;
                nguoiDuyets: {
                    nguoiDuyetId: number;
                    tenDangNhap: string;
                    hoTen: string;
                    emailCongTy: string;
                    tenPhongBan: string;
                    soMayLe: string
                }[],
                dinhKem: {
                    urlDownloadAll: string;
                    items: {
                        urlDownload: string;
                        urlPreview: string;
                        tenFile: string
                    }[]
                }
            }
        ]
    }
}

export interface RequestsPaymentList {
    checkbox: boolean;
    hoSoId: number;
    HoSoIds: number;
    soChungTu: string;
    tenNguoiTao: string;
    tongTien: number;
    tongTienNgoaiTe: string;
    noiDung: string;
    tenNhaCungCap: string;
    tenBoPhan: string;
    ngayYeuCau: string;
    tenTrangThai: string;
    dinhKem: {
        urlDownloadAll: string;
        items: {
            fileName: string;
            urlDownload: string;
            urlPreview: string;
            hoSoGiayToId: number;
        }[]
    },
    ngayKetThuc: string;
    loaiThanhToan: string;
    soChungTuNoiBo: string;
    ngayThanhToan: string;
    isAllowPheDuyet: boolean;
    isAllowXacNhanThanhToan: boolean;
    isThanhToanUuTien: boolean;
    isAllowTaoLai: boolean;
    isAllowPrint: true
}

export interface ThongTinNganSachTTTU {
    departmentCode: string;
    departmentName: string;
    budgetName: string;
    description: string;
    month: number;
    period: string;
    savingsRatio: number;
    fullYearBudget: number;
    budgetToUse: number;
    usedBudget: number;
    remainingBudget: number;
}