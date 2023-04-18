export interface PurchaseContactCreate {
  idYCMHs: number[],
  toTrinhNoiBoKey: string;
  idDeXuatLuaChonNCCs: number[],
  daiDienMuaHangKeys: string[],
  boPhanYCMHKeys: string[],
  isBoPhanTuMua: boolean;
  nguoiCanDuyetKeys: string[],
  nguoiNhanThongBaoKeys: string[],
  soHopDong: string;
  loaiHopDongKey: string;
  dieuKienThanhToan: string;
  baoHanh: string;
  baoLanh: string;
  doiTacKyHopDongKey: string;
  noiDung: string;
  ghiChu: string;
  hangHoas: HangHoas[],
  giamGia: number;
  vat: number;
  duThaoHopDongs: DuThaoHopDongs[];
  dinhKems: DinhKems[];
}

export interface HangHoas {
  hangHoaKey: string;
  quyCach: string;
  dvt: string;
  soLuong: number;
  donGiaChuaVAT: number;
  thanhTienChuaVAT?: number;
  ghiChu: string;
}

export interface DuThaoHopDongs {
  taiLieuDinhKemKey: string;
  ghiChu: string;
  files: {
    base64?: string;
    fileName: string;
    fileContentBase64: string;
  }[];
}

export interface DinhKems {
  taiLieuDinhKemKey: string;
  ghiChu: string;
  files: {
    base64?: string;
    fileName: string;
    fileContentBase64: string;
  }[];
}