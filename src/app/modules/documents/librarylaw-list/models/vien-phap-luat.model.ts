export interface VienPhapLuatList {
    thuVienPhapLuatId: number;
    nhomPhapLuatDisplay: string;
    tenVanBan: string;
    maVanBan: string;
    phamViApDungDisplays: string[];
    chuTheBanHanh: string;
    ngayHieuLuc: string;
    isAllowXoa: boolean;
    isAllowSua: boolean;
}

export interface VienPhapLuatDetail {
    thuVienPhapLuatId: number;
    maVanBan: string;
    tenVanBan: string;
    phamViApDungDisplays: string[];
    chuTheBanHanh: string;
    ngayHieuLuc: number;
    ngayHetHieuLuc: number;
    dinhKemTiengViet: {
        items: {
            fileName: string;
            taiLieuId: number;
        }[]
    },
    dinhKemTiengAnh: {
        items: {
            fileName: string;
            taiLieuId: number;
        }[]
    },
    link: string
}

export interface VienPhapLuatDetailEdit {
    thuVienPhapLuatId: number;
    maVanBan: string;
    tenVanBan: string;
    chuTheBanHanh: string;
    ngayHieuLuc: number;
    ngayHetHieuLuc: number;
    nhomPhapLuatKey: string;
    phamViApDungKeys: string[];
    link: string;
    dinhKemTiengViet: {
        items: {
            fileName: string;
            taiLieuId: number;
        }[]
    },
    dinhKemTiengAnh: {
        items: {
            fileName: string;
            taiLieuId: number;
        }[]
    }
}