export interface MissionDetail {
    hoSoId: number;
    maDieuDongCongTac: string;
    tenNguoiTao: string;
    tenPhongBanNguoiTao: string;
    hinhThucCongTac: string;
    thongTinDatVe: string;
    thongTinKhachSan: string;
    noiDungCongTac: {
        items: {
            noiDung: string;
            diaDiem: string;
            nghiepVu: string;
            ngayDi: string;
            ngayVe: string;
            soNguoiDi: number;
        }[]
    },
    nguoiDi: {
        items: {
            hoTen: string;
            ngayDi: string;
            ngayVe: string;
            lyDoDoiNgay: string;
            isDatMayBay: boolean;
            isDatKhachSan: boolean;
            isGuiXeTaiCongTy: boolean;
        }[]
    },
    tamUng: {
        items: {
            nguoiDiDisplay: string;
            phiAnSang: {
                hanMuc: number;
                soLuong: number;
                thanhTien: number;
                ghiChu: string
            },
            phiAnTrua: {
                hanMuc: number;
                soLuong: number;
                thanhTien: number;
                ghiChu: string
            },
            phiAnToi: {
                hanMuc: number;
                soLuong: number;
                thanhTien: number;
                ghiChu: string
            },
            phiSinhHoat: {
                hanMuc: number;
                soLuong: number;
                thanhTien: number;
                ghiChu: string
            },
            phiKhachSan: {
                hanMuc: number;
                soLuong: number;
                thanhTien: number;
                ghiChu: string
            },
            phiVanChuyen: {
                hanMuc: number;
                soLuong: number;
                thanhTien: number;
                ghiChu: string
            },
            donViTinh: string
        }[]
    },
    keHoachCongTac: {
        keHoachCongTacId: number;
        nam: number;
        thang: number;
    },
    ngayTao: string;
    isAllowPheDuyet: boolean;
    isBuocCuoi: boolean;
    isAllowTrinhDuyet: boolean;
    isAllowBoSung: boolean;
    isGuiXeTaiCongTy: boolean;
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
            }[]
        }[]
    }
}
