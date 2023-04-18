import { Options } from './../models/options';
export const isNumber = (num) => {
    return /^\d+$/.test(num);
}

export const formatterInputNumber = value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
export const parserInputNumber = value => value.replace(/\$\s?|(,*)/g, '');

export const convertNullToBlank = params => Object.keys(params).forEach(key => {
    if (params[key] === null || params[key] === 'null') {
        params[key] = '';
    }
});

export const renderYearRange = (start: number = 0, end: number = 0) => {
    const data: Options[] = [];
    for (let i = start; i < end; i++) {
        data.push({ value: i.toString(), label: i.toString() });
    }
    return data;
}

// https://summernote.org/deep-dive/
export const configTextEditor = {
    placeholder: 'Diễn giải...',
    tabsize: 2,
    height: '250px',
    toolbar: [
        ['fontsize', ['fontname', 'fontsize', 'color']],
        ['style', ['bold', 'italic', 'underline', 'clear', 'style', 'height']],
        ['font', ['strikethrough', 'superscript', 'subscript', 'link', 'hr']],
        ['para', ['paragraph', 'ul', 'ol']],
        ['insert', ['table', 'picture',]],
        ['misc', ['undo', 'redo']],
        ['view', ['codeview', 'fullscreen']],
    ],
    fontSizes: ['8', '9', '10', '11', '12', '14', '18', '24', '36', '44', '56', '64', '76', '84', '96'],
    fontNames: ['Arial', 'Times New Roman', 'HyundaiSansText', 'Inter', 'Comic Sans MS', 'Courier New', 'Roboto']
    // fontNames: ['Arial', 'Times New Roman', 'HyundaiSansText', 'Inter', 'Comic Sans MS', 'Courier New', 'Roboto', 'MangCau', 'BayBuomHep','BaiSau','BaiHoc','CoDien','BucThu', 'KeChuyen', 'MayChu', 'ThoiDai', 'ThuPhap-Ivy', 'ThuPhap-ThienAn']
};

/**
 * Remove field null
 * @param obj 
 * @returns 
 */
export const removeEmpty = (obj) => {
    return Object.fromEntries(Object.entries(obj).filter(([_, v]) => (v != null && v != '')));
}

/**
 * Eg: 2020 curent
 * this.years(5,5) => [2015,...2025]
 * @param startYear 
 * @returns 
 */
export const years = (start: number = 5, end: number = 5) => {
    const years: any[] = [];
    const endYear = new Date().getFullYear() + end;
    let startYear = new Date().getFullYear() - start;
    while (startYear <= endYear) {
        years.push(startYear++);
    }
    return years;
}

/**
 * this.firstAndLastDayOfMonth('2021', '9')
 * @param year 
 * @param month 
 * @returns 
 */
export const firstAndLastDayOfMonth = (year: string, month: string) => {
    let date = null;

    if (year && month) {
        date = new Date().setFullYear(Number(year));
        date = new Date(date).setMonth(Number(month) - 1);
    }

    if (year && !month) {
        date = new Date().setFullYear(Number(year));
    }

    if (!year && month) {
        date = new Date().setMonth(Number(month) - 1);
    }

    // Start date of the month
    let first_date = new Date(date); //Make a copy of the date we want the first and last days from
    first_date.setUTCDate(1); //Set the day as the first of the month

    // End date of the month
    let last_date = new Date(first_date); //Make a copy of the calculated first day
    last_date.setUTCMonth(last_date.getUTCMonth() + 1); //Add a month
    last_date.setUTCDate(0); //Set the date to 0, this goes to the last day of the previous month

    // const date = new Date();
    // const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    // const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    // NOTE: new Date(new Date().getFullYear(), 11, 31)  // Final day of the year

    return { firstDate: first_date, lastDate: last_date };
}

/**
 * <div #scollEl/>
 * this.scrollEl(scollEl, 500);
 * @param el 
 * @param timeout 
 */
export const scrollEl = (el?: HTMLElement, timeout = 0, focusInput = false) => {
    if (timeout) {
        setTimeout(() => {
            el && el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            focusInput && el.focus();
        }, timeout);
    } else {
        el && el.scrollIntoView();
        focusInput && el.focus();
    }
}

/**
 * Trim string from the dynamic object
 * @param obj 
 * @returns 
 */
export const getTrimmedData = obj => {
    if (obj && !(obj instanceof FormData)) {
        if (obj && typeof obj === "object") {
            Object.keys(obj).map(key => {
                if (typeof obj[key] === "object") {
                    getTrimmedData(obj[key]);
                } else if (typeof obj[key] === "string") {
                    obj[key] = obj[key].trim();
                }
            });
        }
    }
    return obj;
};

/**
 * Id radom
 * @returns 
 */
export const numberId = () => new Date().getTime() + Math.floor(Math.random() * 1000);

/**
 * Convert null or number
 * @param number 
 * @returns 
 */
export const nullOrNumberOnly = (number) => (number === '' || number === undefined || number === null) ? null : Number(number);