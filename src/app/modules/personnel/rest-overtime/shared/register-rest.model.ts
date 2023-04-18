export interface SearchCalendarParams {
    FromDate: string;
    ToDate: string;
    Status: string;
    Page: number;
    PageSize: number;
}

export interface UserPosition {
    STT: number;
    EMPLOYEE_ID: number;
    IMAGE_PATH: string;
    FULLNAME_VN: string;
    JOB_TITLE_NAME: string;
    ORG_NAME: string;
    WORK_STATUS: number;
    ORG_NAME2: string;
    ORG_NAME3: string;
    MOBILE_PHONE: string;
    WORK_EMAIL: string;
    BIRTH_DATE: string;
    GENDER: string;
    PER_ADDRESS: string;
    ORG_ID: number;
    MA_CHAMCONG: number;
    SO_MAYLE: string;
    MANAGER_ID: number;
}

export interface BodyRegisterLeave {
    LEAVEFROM: string;
    LEAVETO: string;
    NOTE: string;
    TYPELEAVE: string;
    RECIPIENT: string;
    IS_DOTXUAT: string;
}