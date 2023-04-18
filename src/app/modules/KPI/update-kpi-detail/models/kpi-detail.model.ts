export interface KpiDetailUpdate {
    kpiQuyId: number;
    quyDisplay: string;
    namDisplay: string;
    phongBanDisplay: string;
    nguoiPhuTrachDisplay: string;
    truongBoPhanDisplay: string;
    quyTrinhDuyetDisplay: string;
    items: {
        kpiQuyChiTietId: number;
        mucTieu: string;
        tenKPI: string;
        noiDungCongThuc: string;
        nhanSuChiuTrachNhiemDisplays: string[],
        donViTinhDisplay: string;
        loaiKPIDisplay: string;
        tanSuatTheoDoiDisplay: string;
        thanhPhans: {
            kpiQuyThanhPhanChiTietId: number;
            thanhPhanKey: string;
            thanhPhanDisplay: string;
            giaTri1: number;
            giaTri2: number;
            giaTri3: number;
            thucTeHoanThanh: number;
            isAllowDuyet: boolean;
            yKienNguoiPheDuyet: string;
            trangThaiThanhPhanChiTietKey: string; // 1: duyệt, 2: không duyệt, 3: khóa, 4: không khóa
        }[],
        chiTieuHoanThanh: number;
        noiDungGiaiTrinh: {
            noiDungGiaiTrinh: string;
            dinhKems: {
                tenFile: string;
                urlDownload: string;
            }[]
        }
    }[],
    isAllowDeXuat: boolean;
    isChuaKhoiTao?: boolean;
    isAllowKhoiTao?: boolean; // FIX ts
}

export interface KpiDetail {
    kpiQuyId: number;
    quyDisplay: string;
    namDisplay: string;
    phongBanDisplay: string;
    nguoiPhuTrachDisplay: string;
    truongBoPhanDisplay: string;
    quyTrinhDuyetDisplay: string;
    items: {
        kpiQuyChiTietId: number;
        mucTieu: string;
        tenKPI: string;
        noiDungCongThuc: string;
        nhanSuChiuTrachNhiemDisplays: string[],
        donViTinhDisplay: string;
        loaiKPIDisplay: string;
        tanSuatTheoDoiDisplay: string;
        thanhPhans: {
            kpiQuyThanhPhanChiTietId: number;
            thanhPhanKey: string;
            thanhPhanDisplay: string;
            giaTri1: number;
            giaTri2: number;
            giaTri3: number;
            thucTeHoanThanh: number;
            trangThaiThanhPhanChiTietKey: string
        }[],
        trongSo: number;
        chiTieuHoanThanh: number;
        noiDungGiaiTrinh: {
            noiDungGiaiTrinh: string;
            dinhKems: {
                tenFile: string;
                urlDownload: string
            }[]
        }
    }[],
    isAllowDeXuat: boolean; // FIX ts
    isChuaKhoiTao?: boolean; // FIX ts
    isAllowKhoiTao?: boolean;
}