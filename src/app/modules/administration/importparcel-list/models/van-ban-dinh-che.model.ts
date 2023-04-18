export interface VanBanDinhChe {
    isAllowDelete: boolean;
    isAllowDownload: boolean;
    isAllowEdit: boolean;
    maVanBan: string;
    ngayHetHieuLuc: number;
    ngayHieuLuc: number;
    nguoiTaoId: number;
    quyenTruyCap?: string;
    phamViApDung?: string;
    quyenTruyCaps?: string[];
    phamViApDungs?: string[];
    tenTrangThai: string;
    tenVanBan: string;
    tenNguoiTao?: string;
    vanBanDinhCheId: number;
    attachments: Object[];
}