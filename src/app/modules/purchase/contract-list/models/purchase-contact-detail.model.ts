export interface PurchaseContactDetail {
    idDeNghi?: number;
    soDeNghi?: string;
    tenLoaiHopDong?: string;
    ngayTao?: string;
    ycmHs?: {
        maYCMH?: string;
        idYCMH?: number;
    }[];
    deXuatNCCs?: {
        soDeXuat?: string;
        idDeXuat?: number;
    }[];
    tenDieuKienThanhToan?: string;
    idToTrinh?: number;
    soToTrinh?: string;
    baoHanh?: string;
    soDeXuatLuaChonNCC?: string;
    baoLanh?: string;
    tenDoiTacKyHopDong?: string;
    noiDung?: string;
    ghiChu?: string;
    isAllowPheDuyet?: boolean;
    isAllowTuChoi?: boolean;
    isAllowThamVan?: boolean;
    isAllowResponseThamVan?: boolean;
    thamVan?: {
        noiDungTrinhKi?: string;
        noiDungKiemTra?: string;
        noiDungThuKiThamVans?: {
            noiDungThamVan?: string;
            isDaPheDuyet?: boolean;
            noiDungPhanHoi?: string;
            lineId?: number;
        }[];
    },
    duThaoHopDong?: {
        items?: {
            ghiChu?: string;
            fileDinhKems?: {
                tenFile?: string;
                url?: string;
            }[];
        }[];
    },
    thongTinHangHoaDichVu?: {
        items?: {
            maHangHoaDichVu?: string;
            tenHangHoaDichVu?: string;
            tenDVT?: string;
            soLuong?: number;
            donGiaChuaVAT?: number;
            ghiChu?: string;
            quyCach?: string;
        }[],
        tongTienChuaVAT?: number;
        vat?: number;
        tongTienCoVAT?: number;
        tongTienGiamGia?: number;
    },
    taiLieuDinhKem?: {
        items?: {
            loaiHoSo?: string;
            ghiChu?: string;
            ngayTao?: string;
            fileDinhKems?: {
                tenFile?: string;
                url?: string;
            }[];
        }[];
    },
    lichSuPheDuyet?: {
        items?: {
            nguoiDuyet?: string;
            chucDanh?: string;
            content?: string;
            ngayDuyet?: string;
            tinhTrangKey?: string;
            tenTrangThai?: string;
            ghiChu?: string;
            department?: string;
            departmentParent?: string;
        }[];
    }
}
