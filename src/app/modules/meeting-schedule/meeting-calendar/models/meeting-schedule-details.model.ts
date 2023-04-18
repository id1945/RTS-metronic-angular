export interface MeetingScheduleDetails {
    congViecId: number;
    tieuDe: string;
    tieuDeEng: string;
    soLuong: string;
    thoiGianBatDau: number;
    thoiGianKetThuc: number;
    thanhPhanKhach: string;
    nguoiThamDu?: {
        items: {
            phongBanKey: string;
            phongBanDisplay: string;
            nhanVienKey: string;
            nhanVienDisplay: string;
        }[]
    },
    nhanVien?: {
        items: {
            phongBanKey: string;
            phongBanDisplay: string;
            nhanVienKey: string;
            nhanVienDisplay: string;
        }[]
    },
    dinhKem: {
        urlDownloadAll: string;
        items: {
            urlDownload: string;
            urlPreview: string;
            tenFile: string;
        }[]
    },
    dvTra: boolean;
    dvCoffee: boolean;
    dvTeaBreak: boolean;
    dvHoa: boolean;
    dvBienTen: boolean;
    dvBackdrop: boolean;
    dvTrucTuyen: boolean;
    yeuCauKhac: string;
    tenPhongHop: string;
    khuVucKey: string;
    khuVucDisplay: string;
    noteForLeTan: string;
    noteByLeTan: string;
    isCoHieuLuc: boolean;
    phongHopId: number;
    ngayTao: string;
}