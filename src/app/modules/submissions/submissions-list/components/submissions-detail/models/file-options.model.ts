import { Options } from 'src/app/_metronic/shared/shared/models/options';

export interface FileOptions extends Options {
    fileName: string;
    fileContentBase64: string;
    base64: string;
}
