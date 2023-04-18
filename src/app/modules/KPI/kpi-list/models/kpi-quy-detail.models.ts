export interface KpiQuyDetail {
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
            isAllowRaSoat: boolean;
            yKienNguoiPheDuyet: string;
            trangThaiThanhPhanChiTietKey: string;
            isKHCL: boolean;
        }[],
        chiTieuHoanThanh: number;
        noiDungGiaiTrinh: {
            noiDungGiaiTrinh: string;
            dinhKems: {
                tenFile: string;
                urlDownload: string
            }[]
        }
    }[],
    trangThaiHienTai: {
        tenTrangThai: string;
        nguoiPheDuyet: string
    },
    lichSuPheDuyet: {
        items: KpiQuyDetailLichSuPheDuyet[]
    },
    isAllowPheDuyet: boolean;
    isAllowCapNhatKetQua: boolean;
    isAllowXemKetQua: boolean;
    isAllowShowColumnRaSoat: boolean;
    isAllowShowColumnYKienNguoiPheDuyet: boolean;
}

export interface KpiQuyDetailLichSuPheDuyet {
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
    }[]
}