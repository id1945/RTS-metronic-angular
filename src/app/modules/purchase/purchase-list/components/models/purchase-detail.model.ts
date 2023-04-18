export interface PurchaseDetail {
    id: number;
    maYCMH: string;
    ngayTao: number;
    trangThai: string;
    mucDich: string;
    ghiChu: string;
    toTrinhNoiBoKey: string;
    toTrinhNoiBoDisplay: string;
    loaiNghiepVuKey: string;
    loaiNghiepVuDisplay: string;
    kieuMuaSamKey: string;
    kieuMuaSamDisplay: string;
    isAllowPheDuyet: boolean;
    isAllowTuChoi: boolean;
    isAllowThamVan: boolean;
    isAllowResponseThamVan: boolean;
    isAllowEdit: boolean;
    isAllowBackToDraft: boolean;
    thamVan: {
        noiDungTrinhKi: string;
        noiDungKiemTra: string;
        noiDungThuKiThamVans: {
            noiDungThamVan: string;
            isDaPheDuyet: boolean;
            noiDungPhanHoi: string;
            lineId: number;
        }[]
    },
    thongTinHangHoaDichVus: {
        hangHoaId: number;
        hangHoaKey: string;
        tenHangHoaDichVu: string;
        quyCach: string;
        dvt: string;
        giaThamKhao: number;
        soLuong: number;
        duToanDonGia: number;
        duToanThanhTien: number;
        maNganSach: string;
        ngayMongMuon: string;
        nccDaGiaoDich: string[],
        nccDeXuat: string[],
        ghiChu: string;
        nganSachKey: string;
        isBoPhanTuMua: boolean;
        isChiDinhNCC: boolean;
    }[],
    tongDuToan: number;
    boPhanLienQuans: {
        boPhanLienQuanKey: string;
        tenBoPhan: string;
        tenNhanVien: string;
    }[],
    taiLieuDinhKems: {
        taiLieuId: number;
        loaiHoSo: string;
        taiLieuDinhKemKey: string;
        ghiChu: string;
        fileDinhKems: {
            fileId: number;
            tenFile: string;
            url: string;
        }[]
    }[],
    lichSuPheDuyets: {
        nguoiDuyet: string;
        chucDanh: string;
        content: string;
        ngayDuyet: string;
        tinhTrangKey: string;
        tenTrangThai: string;
        ghiChu: string;
        department: string;
        departmentParent: string;
        email: string;
    }[],
    nguoiTao: {
        hoTen: string;
        departmentName: string;
    }
}

export interface ThongTinNganSach {
    departmentCode: string;
    departmentName: string;
    budgetName: string;
    description: string;
    month: number;
    period: string;
    savingsRatio: number;
    fullYearBudget: number;
    budgetToUse: number;
    usedBudget: number;
    remainingBudget: number;
}

// For request params
export interface ThongTinHangHoaDichVus {
    tenHangHoaDichVu: string;
    quyCach: string;
    dvt: string;
    soLuong: number;
    giaDuToan: number;
    giaThamKhao: number;
    maNganSach: string;
    isBoPhanTuMua: boolean;
    ngayMongMuon: string;
    nccDaGiaoDich: string[];
    nccDeXuat: string[];
    ghiChu: string;
    hangHoaId: number;
    hangHoaKey: string;
    nganSachKey: string;
    yearPay: string;
    monthPay: string;
    isChiDinhNCC: true;
    nhaCungCapDeXuatKeys: string[];
    quyCachEng: string;
    ghiChuEng: string;
    // Not allow body param
    nha_ccdx_total?: number;
    nha_ccdx_keys?: string;
    nha_ccdx_name?: string;
}