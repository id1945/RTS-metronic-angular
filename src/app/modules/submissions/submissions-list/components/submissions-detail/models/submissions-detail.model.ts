export interface SubmissionsDetail {
    hoSoId: number;
    quyTrinhId: number;
    tenNguoiTao: string;
    tenPhongBanNguoiTao: string;
    isMucDoTrinhKyGap: boolean;
    maToTrinh: string;
    tenToTrinh: string;
    isTrongNganSach: boolean;
    loaiNghiepVuDisplay: string;
    noiDung: string;
    trangThaiHienTai: string;
    nguoiPheDuyet: string;
    ngayTao: number;
    soLanTuChoi: number;
    lyDoTuChoi: string;
    isAllowPheDuyet: boolean;
    isAllowThamVan: boolean;
    isAllowDongTrinh: boolean;
    dinhKem: {
        urlDownloadAll: string;
        items: {
            fileName: string;
            hoSoGiayToId: number;
            urlDownload: string;
            urlPreview: string
        }[]
    },
    chiPhi: {
        items: {
            khoanChi: string;
            soLuong: number;
            donGiaDuKien: number;
            thanhTienDuKien: number;
            maChiPhiKey: string;
            maChiPhiDisplay: string;
            tinhTrang: string;
            ghiChu: string;
            yearPay: number;
            monthPay: number;
        }[],
        tongThanhTien: number;
    },
    boPhanDongTrinh: {
        items: {
            tenBoPhan: string;
            tenDangNhap: string;
            tenNhanVien: string;
            tinhTrang: string;
            noiDung: string;
            ngayXacNhan: string;
        }[]
    },
    lichSuPheDuyet: {
        items: {
            nguoiDuyet: string;
            hoTenNguoiDuyet: string;
            userNameNguoiDuyet: string;
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
            buocThucHienId: number;
            soLanTuChoi: number;
            lyDoTuChoi: string
        }[]
    },
    thamVan: {
        noiDungTrinhKy: string;
        raSoatNoiDung: string;
        thamVanThuKyTGD: string;
    }
}

export interface ThongTinNganSach {
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