export interface EKpiList {
    kpiMucTieuId: number;
    mucTieu: string;
    keHoachCongViecs: {
        soThuTu: string;
        noiDungMucTieuNho: string;
    }[],
    tenKPI: string;
    noiDungCongThuc: string;
    donViTinhDisplay: string;
    loaiKPIDisplay: string;
    trongSo: number;
    tanSuatTheoDoiDisplay: string;
    thanhPhanDisplays: string[],
    tienDoCaNam: number;
    quy1: number;
    quy2: number;
    quy3: number;
    quy4: number;
    nhanSuChiuTrachNhiemDisplays: string[],
    ghiChu: string;
    yKienNguoiPheDuyet: string;
    isCheck: true,
    isLock: true,
    apCongThuc: true,
    congThucTinh: {
        kpiCongThucTinhId: number;
        congThucTinhThucTe: string;
        loaiCongThucKey: string;
        thanhPhans: {
            thanhPhanKey: string;
            thanhPhanDisplay: string;
        }[]
    },
    trangThaiSoSanhKey: string;
}

export interface EKpiDetail {
    kpiMucTieuId: number;
    mucTieuBoPhanKey: string;
    keHoachCongViecLienQuanKeys: string[],
    tenKPI: string;
    noiDungCongThuc: string;
    thanhPhans: {
        thanhPhanKey: string;
        thanhPhanDisplay: string
    }[],
    nhanSuChiuTrachNhiemKeys: string[],
    donViTinhKey: string;
    loaiKPIKey: string;
    tanSuatTheoDoiKey: string;
    trongSo: number;
    ghiChu: string;
    tienDoCaNam: number;
    quy1: number;
    quy2: number;
    quy3: number;
    quy4: number;
    trongSoMax: number;
}