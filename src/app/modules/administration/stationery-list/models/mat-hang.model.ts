export interface MatHang {
    matHangKey?: string;
    matHangDisplay?: string;
    maVPP?: string;
    donViTinhKey?: string;
    donViTinhDisplay?: string;
    donGia?: number;
    vat?: number;
    checked?: boolean;
    soLuong?: number;
    thanhTien?: number;
    trangThaiMuaKey?: string;
    nguoiSuDungKeys?: any[];
    ghiChu?:string;
}

export interface DetailVPP {
    khuVucKey: string;
    ghiChu: string;
    hangs: MatHang[]
}