export interface deliveryList {
    hoSoId: number;
    maHoSo: string;
    ngayTao: string;
    tenNguoiTao: string;
    tenPhongBanNguoiTao: string;
    tenNguoiNhan: string;
    diaChiNguoiNhan: string;
    loaiDonDisplay: string;
    hinhThucChuyenDisplay: string;
    trangThaiDisplay: string;
    donViVanChuyenDisplay: string;
    donViVanChuyenURL: string;
    maVanDon: string;
    ngayCapNhanVanDon: string;
    isAllowTaoLai: true,
    isAllowEdit: true,
    isAllowDelete: true,
    isAllowXacNhan: true,
    isAllowNhapVanDon: true
}

export interface deliveryDetail {
    hoSoId: number;
    tenNguoiNhan: string;
    diaChiNguoiNhan: string;
    ngayGiao: string;
    loaiDonKey: string;
    noiDung: string;
    soLuong: number;
    nguoiNhanKey: string;
    tenCongTyNhan: string;
    sdtNguoiNhan: string;
    donViVanChuyenKey: string;
    loaiBuuPhamKey: string;
    trongLuong: number;
    loaiThanhToanKey: string;
    dongGoiKey: string;
    hinhThucChuyenKey: string
}