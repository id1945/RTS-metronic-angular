export interface DataTable<T> {
    items: T[];
    columns: Columns[];
    selected?: T[];
    columns2?: Columns[];
    columns3?: Columns[];
    columns4?: Columns[];
    isActive?: boolean;
    // other
    isAllowThemMoi?: boolean;
    meta?: any;
}

export interface Columns {
    field?: string;
    sortField?: string;
    title?: string;
    width?: string;
    rowspan?: string;
    colspan?: string;
    align?: string;
    pipe?: string;
    className?: string;
    isActive?: boolean;
    isRequired?: boolean;
    stickyR?: boolean;
    stickyL?: boolean;
    top?: string;
}