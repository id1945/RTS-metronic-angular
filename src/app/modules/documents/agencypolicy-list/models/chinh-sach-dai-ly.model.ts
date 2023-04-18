export interface ChinhSachDaiLyList {
    chinhSachDaiLyId: number;
    phongBanDisplay: string;
    tenChinhSach: string;
    ngayBanHanh: string;
    trangThaiDisplay: string;
    urlDownload: string;
    isAllowEdit: boolean;
    isAllowDelete: boolean;
    isAllowDownload: boolean;
}

export interface ChinhSachDaiLyCreate {
    TenChinhSach: string;
    MaChinhSach: string;
    NgayBanHanh: string;
    NgayHetHieuLuc: string;
    TenBoPhanBanHanh: string;
    BoPhanXemKeys: any[];
    VungMienXemKeys: any[];
    TinhThanhXemKeys: any[];
    DaiLyXemKeys: any[];
    DinhKems: any[];
    TrangThaiKey: string;
    IsAllowDownload: boolean;
}

export interface ChinhSachDaiLyEdit {
    ChinhSachDaiLyId: number;
    TenChinhSach: string;
    MaChinhSach: string;
    NgayBanHanh: number;
    NgayHetHieuLuc: number;
    TenBoPhanBanHanh: string;
    BoPhanXemKeys: any[];
    VungMienXemKeys: any[];
    TinhThanhXemKeys: any[];
    DaiLyXemKeys: any[];
    DinhKems: any[];
    TrangThaiKey: string;
    IsAllowDownload: boolean;
}

export interface ChinhSachDaiLyDetail {
    chinhSachDaiLyId: number;
    tenChinhSach: string;
    maChinhSach: string;
    ngayBanHanh: number;
    ngayHetHieuLuc: number;
    tenBoPhanBanHanh: string;
    boPhanXemDisplays: string[];
    vungMienXemDisplays: string[];
    tinhThanhXemDisplays: string[];
    daiLyXemDisplays: string[];
    dinhKems: {
        tenFile: string;
        urlDownload: string;
        urlPreview: string
    }[];
    trangThaiKey: string;
    isAllowDownload: true
}


export interface ChinhSachDaiLyDetailEdit {
    chinhSachDaiLyId: number;
    tenChinhSach: string;
    maChinhSach: string;
    ngayBanHanh: number;
    ngayHetHieuLuc: number;
    tenBoPhanBanHanh: string;
    boPhanXems: {
        boPhanXemKey: string;
        boPhanXemDisplay: string
    }[];
    vungMienXems: {
        vungMienXemKey: string;
        vungMienXemDisplay: string
    }[];
    tinhThanhXems: {
        tinhThanhXemKey: string;
        tinhThanhXemDisplay: string
    }[];
    daiLyXems: {
        daiLyXemKey: string;
        daiLyXemDisplay: string
    }[];
    dinhKems: {
        tenFile: string;
        urlDelete: string;
        urlDownload: string;
        urlPreview: string
    }[];
    trangThaiKey: string;
    isAllowDownload: true
}