export interface Detail {
    id: number,
    maYCMH: string,
    ngayTao: string,
    trangThai: string,
    mucDich: string,
    ghiChu: string,
    isAllowDongTrinh: boolean
    isMucDoTrinhKyGap: boolean
    toTrinhNoiBoKey: string,
    isAllowPheDuyet: boolean,
    isAllowTuChoi: boolean,
    isAllowThamVan: boolean,
    isAllowResponseThamVan: boolean,
    thamVan: ThamVan,
    thongTinHangHoaDichVus: ThongTinHangHoaDichVus[],
    giaThamKhao: number,
    boPhanLienQuans: BoPhanLienQuans[],
    taiLieuDinhKems: TaiLieuDinhKems[],
    lichSuPheDuyets: LichSuPheDuyets[],
    nguoiTao: NguoiTao
}

export interface ThamVan {
    noiDungTrinhKi: string,
    noiDungKiemTra: string,
    noiDungThuKiThamVans: [
        {
            noiDungThamVan: string,
            isDaPheDuyet: boolean,
            noiDungPhanHoi: string
        }
    ]
}

export interface ThongTinHangHoaDichVus {
    tenHangHoaDichVu: string,
    quyCach: string,
    dvt: string,
    soLuong: number,
    giaDuToan: number,
    giaThamKhao: number,
    maNganSach: string,
    ngayMongMuon: string,
    nccDaGiaoDich: [
        string
    ],
    nccDeXuat: [
        string
    ],
    ghiChu: string
}


export interface BoPhanLienQuans {
    tenBoPhan: string,
    tenNhanVien: string
}

export interface TaiLieuDinhKems {
    loaiHoSo: string,
    ghiChu: string,
    fileDinhKems: [
        {
            tenFile: string,
            url: string
        }
    ]
}

export interface LichSuPheDuyets {
    nguoiDuyet: string,
    chucDanh: string,
    content: string,
    ngayDuyet: string,
    tinhTrangKey: string,
    ghiChu: string
}

export interface NguoiTao {
    hoTen: string,
    departmentName: string
}
