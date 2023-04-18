export interface Detail {
    hoSoId?: number,
    maYCMH: string,
    ngayTao: string,
    trangThai: string,
    mucDich: string,
    ghiChu: string,
    toTrinhNoiBoKey: string,
    isAllowPheDuyet: true,
    isAllowTuChoi: true,
    isAllowThamVan: true,
    isAllowResponseThamVan: true,
    giaThamKhao: number,
    lichSuPheDuyet: {
        items: LichSuPheDuyets[],
    },
    nguoiTao: NguoiTao,
}
export interface LichSuPheDuyets {
    ngayDuyet: number,
    nguoiDuyet: string,
    noiDung: string,
    tenBuocThucHien: string,
    tenTrangThai: string,
    tinhTrang: string,
    tinhTrangKey: string,
}

export interface NguoiTao {
    hoTen: string,
    departmentName: string
}
