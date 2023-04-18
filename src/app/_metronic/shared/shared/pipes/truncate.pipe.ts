import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
})
export class TruncatePipe implements PipeTransform {
  /**
   * @description Truncate for long text ...
   * @description {{longStr | truncate }}
   * @description Outputs: A really long string that...
   * @description {{longStr | truncate : 12 }}
   * @description Outputs: A really lon...
   * @description {{longStr | truncate : 12 : true }}
   * @description Outputs: A really...
   * @description {{longStr | truncate : 12 : false : '***' }}
   * @description Outputs: A really lon***
   * @param value: string
   * @param limit: number
   * @param completeWords: boolean
   * @param ellipsis: string
   * @return string
   */
  transform(
    value: string,
    limit = 25,
    completeWords = false,
    ellipsis = '...'
  ): string {
    if (completeWords) {
      limit = value.substr(0, limit).lastIndexOf(' ');
    }
    return value?.length > limit ? value.substr(0, limit) + ellipsis : value;
  }
}