import { TranslateService } from '@ngx-translate/core';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Params } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import swal from 'sweetalert';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import { PER_SCREEN } from '../../../shared/constant';
const HEADER_ACCEPT = { headers: { 'Accept': 'application/json' } };
import { DataTable, Columns } from 'src/app/_metronic/shared/shared/models/dataTable';
import { DynamicAsideMenuService } from 'src/app/_metronic/core';
import { catchError } from 'rxjs/operators';

interface Paging {
  Type: string;
  KeyEmployee: string;
  FromDate: string;
  ToDate: string;
}

@Component({
  selector: 'app-table-approve-rest-overtime',
  templateUrl: './table-approve-rest-overtime.component.html',
  styleUrls: ['./table-approve-rest-overtime.component.scss'],
  exportAs: 'element'
})
export class TableApproveRestOvertimeComponent implements OnInit {

  @Input() params: Params;
  @Input() status: string;
  @Input() isSearchAdvance = false;
  @Output() loadList = new EventEmitter();

  public tabIndex = 0;
  public opinion: string;
  public PER_SCREEN = PER_SCREEN;

  // Paginator
  public paginator = {
    pageSize: 20,
    page: 1,
    totalRecord: 0,
  };

  // Table
  public dataTable: DataTable<any> = {
    items: [],
    columns: [] as Columns[],
  };

  constructor(
    private api: ApiService,
    private menu: DynamicAsideMenuService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.setColumns();
  }

  /**
   * LOAD LIST
   * @param paginator 
   * @param index 
   */
  public fetchList(paginator?: Paging, index?: number): void {
    this.dataTable.items = [];
    // update thead table
    this.tabIndex = index;
    this.setColumns();
    // get list
    const bodyParams = {
      ...paginator,
      Status: this.status,
      Page: this.paginator.page,
      PageSize: this.paginator.pageSize
    };
    // Set url
    let url = null;
    switch (this.params?.screen) {
      case PER_SCREEN.HOLIDAY:
        url = '/API/Mobile/SearchApprovedLeave';
        break;
      case PER_SCREEN.OVERTIME:
        url = '/API/Mobile/SearchApprovedOT';
        break;
      case PER_SCREEN.WLEO:
        url = '/API/Mobile/SearchApprovedWLEO';
        break;
      case PER_SCREEN.EXPLAIN:
        url = '/API/Mobile/SearchApprovedExplain';
        break;
      default:
        break;
    }
    // Call
    this.api.post(url, bodyParams, HEADER_ACCEPT).subscribe(res => {
      if (res?.ResponseStatus === 1) {
        this.dataTable.items = res?.Items?.map(m => ({ ...m, checkbox: false }));
        this.paginator = { ...this.paginator, totalRecord: res?.ParameterOutput?.ApprovedCount };
      }
    })
  }

  /**
   * APPROVE
   */
  public onApprove() {
    // Khai báo biến
    let bodyParams = [];
    let multipleRequest = [];

    // Convert params
    this.dataTable.items.forEach(el => {
      if (el?.checkbox) {
        bodyParams.push({ RegisterID: el?.ID, Comment: this.opinion?.trim() ?? 'Phê duyệt' });
      }
    });

    // Validate checkbox
    if (bodyParams.length == 0) {
      this.api.errorMessage('Chưa có bản ghi nào được chọn!');
      return;
    }

    // Set url
    let url = null;
    switch (this.params?.screen) {
      case PER_SCREEN.HOLIDAY:
        url = '/API/Mobile/ApproveRegisterLeave';
        break;
      case PER_SCREEN.OVERTIME:
        url = '/API/Mobile/ApproveRegisterOT';
        break;
      case PER_SCREEN.WLEO:
        url = '/API/Mobile/ApproveWLEO';
        break;
      case PER_SCREEN.EXPLAIN:
        url = '/API/Mobile/ApproveTimeExplain';
        break;
      default:
        break;
    }

    // Http loop
    url && bodyParams?.forEach(params => {
      multipleRequest.push(this.api.post(url, params, HEADER_ACCEPT).pipe(catchError(error => of(error))));
    });

    // Loading on
    this.api.loadingCustomOn();
    // forkJoin
    multipleRequest.length && forkJoin(multipleRequest).subscribe((res: any) => {
      console.log(res)
      console.log(JSON.stringify(res))
      // Loading off
      this.api.loadingCustomOff();
      // Success
      const successID = res?.filter(f => f?.ResponseStatus === 1)?.map(m => m?.Items?.ID);
      const errorID = bodyParams?.filter(f1 => successID.find(f2 => f2 !== f1?.RegisterID))?.map(m => m?.RegisterID);
      if (successID?.length) {
        swal({
          icon: 'success',
          title: successID.length === bodyParams.length ? 'Duyệt thành công!' : `Duyệt thành công ID: ${successID?.toString()}`,
          buttons: {
            ok: this.translate.instant('COMMON.btn.close'),
          },
        } as any).then(() => {
          if (errorID?.length) {
            this.api.errorMessage(`Duyệt không thành công ID: ${errorID?.toString()}!`);
          }
          this.opinion = '';
          this.menu.loadBadgesNhanVien(); // Load menu count
          this.loadList.emit();
        });
      } else {
        this.api.errorMessage(res?.[0]);
        // Loading off
        this.api.loadingCustomOff();
      }
    });
    // multipleRequest.length && forkJoin(multipleRequest).subscribe((res: any) => {
    //   res?.forEach(rs => {
    //     if (rs?.ResponseStatus === 1) {
    //       // Message ok
    //       swal({
    //         icon: 'success',
    //         title: 'Duyệt thành công!',
    //         buttons: {
    //           ok: this.translate.instant('COMMON.btn.close'),
    //         },
    //       } as any).then(() => {
    //         this.menu.loadBadgesNhanVien(); // Load menu count
    //         this.opinion = '';
    //         this.loadList.emit();
    //       });
    //     } else {
    //       this.api.errorMessage(rs?.Message);
    //     }
    //     // Loading off
    //     this.api.loadingCustomOff();
    //   });
    // }, res => {
    //   this.api.errorMessage(res)
    //   // Loading off
    //   this.api.loadingCustomOff();
    // });
  }

  /**
   * REJECT
   */
  public onReject() {
    // Khai báo biến
    let bodyParams = [];
    let multipleRequest = [];

    // Convert params
    this.dataTable.items.forEach(el => {
      if (el?.checkbox) {
        bodyParams.push({ RegisterID: el?.ID, Comment: this.opinion?.trim() ?? '' });
      }
    });

    // Validate checkbox
    if (bodyParams.length == 0) {
      this.api.errorMessage('Chưa có bản ghi nào được chọn!');
      return;
    }

    // Reqiured nhập ý kiến
    if (!this.opinion) {
      this.api.errorMessage('Vui lòng nhập ý kiến từ chối!');
      return;
    }

    // Set url
    let url = null;
    switch (this.params?.screen) {
      case PER_SCREEN.HOLIDAY:
        url = '/API/Mobile/CancelRegisterLeave';
        break;
      case PER_SCREEN.OVERTIME:
        url = '/API/Mobile/CancelRegisterOT';
        break;
      case PER_SCREEN.WLEO:
        url = '/API/Mobile/CancelRegisterWLEO';
        break;
      case PER_SCREEN.EXPLAIN:
        url = '/API/Mobile/CancelTimeExplain';
        break;
      default:
        break;
    }

    // Http loop
    url && bodyParams?.forEach(params => {
      multipleRequest.push(this.api.post(url, params, HEADER_ACCEPT));
    });

    // forkJoin
    multipleRequest.length && forkJoin(multipleRequest).subscribe((res: any) => {
      res?.forEach(rs => {
        if (rs?.ResponseStatus === 1) {
          // Message ok
          swal({
            icon: 'success',
            title: 'Huỷ duyệt thành công!',
            buttons: {
              ok: this.translate.instant('COMMON.btn.close'),
            },
          } as any).then(() => {
            this.opinion = '';
            this.loadList.emit();
          });
        } else {
          this.api.errorMessage(rs?.Message);
        }
      });
    }, res => this.api.errorMessage(res));
  }

  /**
   * Set cbox
   */
  get isAllCheckbox(): boolean {
    return this.dataTable.items?.length ? (this.dataTable.items.find(f => f.checkbox === false) ? false : true) : false;
  }

  /**
   * Select cbox
   * @param e 
   */
  public selectCboxAll(e: boolean): void {
    this.dataTable.items = this.dataTable.items?.map(m => ({ ...m, checkbox: e }));
  }

  /**
   * Total hour
   * @param dateOne 
   * @param dateTwo 
   * @returns 
   */
  public totalHour(dateOne, dateTwo): number {
    const milliseconds = Math.abs(new Date(dateTwo).getTime() - new Date(dateOne).getTime());
    return (milliseconds / 36e5);
  }

  /**
   * HEADER & FIELD NAME
   */
  private setColumns() {
    switch (this.params?.screen) {
      case PER_SCREEN.HOLIDAY:
        if (this.tabIndex === 0) {
          this.dataTable.columns = [
            {
              field: 'CHECKBOX',
              align: 'center'
            },
            {
              field: 'EMPLOYEE_CODE',
              title: 'Mã nhân viên',
              width: '130px',
              align: 'left'
            },
            {
              field: 'EMPLOYEENAME',
              title: 'Họ tên',
              width: '130px',
            },
            {
              field: 'TIMECREATE',
              title: 'Ngày đăng ký',
              width: '130px',
              pipe: 'dd/MM/yyyy'
            },
            {
              field: 'LEAVEFROM',
              title: 'Từ ngày',
              width: '130px',
              pipe: 'dd/MM/yyyy'
            },
            {
              field: 'LEAVETO',
              title: 'Đến ngày',
              width: '130px',
              pipe: 'dd/MM/yyyy'
            },
            {
              field: 'TYPELEAVE',
              title: 'Loại đăng ký',
              width: '130px',
            },
            {
              field: 'NOTE',
              title: 'Ghi chú',
              width: '130px',
            },
            {
              field: 'STATUS',
              title: 'Trạng thái',
              width: '130px',
            }
          ];
        }
        if (this.tabIndex > 0) {
          this.dataTable.columns = [
            {
              field: 'EMPLOYEE_CODE',
              title: 'Mã nhân viên',
              width: '130px',
              align: 'left'
            },
            {
              field: 'EMPLOYEENAME',
              title: 'Họ tên',
              width: '130px',
            },
            {
              field: 'TIMECREATE',
              title: 'Ngày đăng ký',
              width: '130px',
              pipe: 'dd/MM/yyyy'
            },
            {
              field: 'LEAVEFROM',
              title: 'Từ ngày',
              width: '130px',
              pipe: 'dd/MM/yyyy'
            },
            {
              field: 'LEAVETO',
              title: 'Đến ngày',
              width: '130px',
              pipe: 'dd/MM/yyyy'
            },
            {
              field: 'TYPELEAVE',
              title: 'Loại đăng ký',
              width: '130px',
            },
            {
              field: 'REMARK',
              title: 'Lý do',
              width: '170px',
            },
            {
              field: 'NOTE',
              title: 'Ghi chú',
              width: '170px',
            },
            {
              field: 'TIMEAPPROVE',
              title: 'Ngày duyệt',
              width: '130px',
              pipe: 'dd/MM/yyyy'
            },
          ];
        };
        break;
      case PER_SCREEN.OVERTIME:
        if (this.tabIndex === 0) {
          this.dataTable.columns = [
            {
              field: 'CHECKBOX',
              align: 'center'
            },
            {
              field: 'ID_EMPLOYEE',
              title: 'Mã nhân viên',
              width: '130px',
              align: 'left'
            },
            {
              field: 'EMPLOYEENAME',
              title: 'Họ tên',
              width: '130px',
            },
            {
              field: 'TIMECREATE',
              title: 'Ngày đăng ký',
              width: '130px',
              pipe: 'dd/MM/yyyy'
            },
            {
              field: 'FROMDATE',
              title: 'Từ ngày',
              width: '130px',
              pipe: 'dd/MM/yyyy'
            },
            {
              field: 'TODATE',
              title: 'Đến ngày',
              width: '130px',
              pipe: 'dd/MM/yyyy'
            },
            {
              field: 'FROMHOUR_TOHOUR',
              title: 'Chi tiết đăng ký',
              width: '180px',
            },
            {
              field: 'FROMHOUR_TOHOUR_TOTAL',
              title: 'Tổng số giờ',
              width: '120px',
            },
            {
              field: 'NOTE',
              title: 'Ghi chú',
              width: '170px',
            },
            {
              field: 'STATUS',
              title: 'Trạng thái',
              width: '130px',
            }
          ];
        }
        if (this.tabIndex === 1) {
          this.dataTable.columns = [
            {
              field: 'ID_EMPLOYEE',
              title: 'Mã nhân viên',
              width: '130px',
              align: 'left'
            },
            {
              field: 'EMPLOYEENAME',
              title: 'Họ tên',
              width: '130px',
            },
            {
              field: 'TIMECREATE',
              title: 'Ngày đăng ký',
              width: '130px',
              pipe: 'dd/MM/yyyy'
            },
            {
              field: 'FROMDATE',
              title: 'Từ ngày',
              width: '130px',
              pipe: 'dd/MM/yyyy'
            },
            {
              field: 'TODATE',
              title: 'Đến ngày',
              width: '130px',
              pipe: 'dd/MM/yyyy'
            },
            {
              field: 'FROMHOUR_TOHOUR',
              title: 'Chi tiết đăng ký',
              width: '180px',
            },
            {
              field: 'FROMHOUR_TOHOUR_TOTAL',
              title: 'Tổng số giờ',
              width: '120px',
            },
            {
              field: 'REMARK',
              title: 'Lý do',
              width: '170px',
            },
            {
              field: 'NOTE',
              title: 'Ghi chú',
              width: '170px',
            },
            {
              field: 'TIMEAPPROVE',
              title: 'Ngày duyệt',
              width: '130px',
              pipe: 'dd/MM/yyyy'
            }
          ];
        }
        if (this.tabIndex === 2) {
          this.dataTable.columns = [
            {
              field: 'ID_EMPLOYEE',
              title: 'Mã nhân viên',
              width: '130px',
              align: 'left'
            },
            {
              field: 'EMPLOYEENAME',
              title: 'Họ tên',
              width: '130px',
            },
            {
              field: 'TIMECREATE',
              title: 'Ngày đăng ký',
              width: '130px',
              pipe: 'dd/MM/yyyy'
            },
            {
              field: 'FROMDATE',
              title: 'Từ ngày',
              width: '130px',
              pipe: 'dd/MM/yyyy'
            },
            {
              field: 'TODATE',
              title: 'Đến ngày',
              width: '130px',
              pipe: 'dd/MM/yyyy'
            },
            {
              field: 'FROMHOUR_TOHOUR',
              title: 'Chi tiết đăng ký',
              width: '180px',
            },
            {
              field: 'FROMHOUR_TOHOUR_TOTAL',
              title: 'Tổng số giờ',
              width: '120px',
            },
            {
              field: 'REMARK',
              title: 'Lý do',
              width: '170px',
            },
            {
              field: 'NOTE',
              title: 'Ghi chú',
              width: '170px',
            },
            {
              field: 'TIMEAPPROVE',
              title: 'Ngày duyệt',
              width: '130px',
              pipe: 'dd/MM/yyyy'
            }
          ];
        }
        break;
      case PER_SCREEN.WLEO:
        if (this.tabIndex === 0) {
          this.dataTable.columns = [
            {
              field: 'CHECKBOX',
              align: 'center'
            },
            {
              field: 'EMPLOYEE_CODE',
              title: 'Mã nhân viên',
              width: '130px',
              align: 'left'
            },
            {
              field: 'EMPLOYEENAME',
              title: 'Họ tên',
              width: '130px',
            },
            {
              field: 'TIMECREATE',
              title: 'Ngày đăng ký',
              width: '130px',
              pipe: 'dd/MM/yyyy'
            },
            {
              field: 'FROMDATE',
              title: 'Từ ngày',
              width: '130px',
              pipe: 'dd/MM/yyyy'
            },
            {
              field: 'TODATE',
              title: 'Đến ngày',
              width: '130px',
              pipe: 'dd/MM/yyyy'
            },
            {
              field: 'FROMHOUR',
              title: 'Từ giờ',
              width: '120px',
              pipe: 'HH:mm'
            },
            {
              field: 'TOHOUR',
              title: 'Đến giờ',
              width: '120px',
              pipe: 'HH:mm'
            },
            {
              field: 'REGTYPE',
              title: 'Loại đăng ký',
              width: '130px',
            },
            {
              field: 'FROMHOUR_TOHOUR',
              title: 'Chi tiết đăng ký',
              width: '170px',
            },
            {
              field: 'TOTALHOUR',
              title: 'Tổng số phút',
              width: '130px',
            },
            {
              field: 'NOTE',
              title: 'Ghi chú',
              width: '170px',
            },
            {
              field: 'STATUS',
              title: 'Trạng thái',
              width: '130px',
            }
          ];
        }
        if (this.tabIndex > 0) {
          this.dataTable.columns = [
            {
              field: 'EMPLOYEE_CODE',
              title: 'Mã nhân viên',
              width: '130px',
              align: 'left'
            },
            {
              field: 'EMPLOYEENAME',
              title: 'Họ tên',
              width: '130px',
            },
            {
              field: 'TIMECREATE',
              title: 'Ngày đăng ký',
              width: '130px',
              pipe: 'dd/MM/yyyy'
            },
            {
              field: 'FROMDATE',
              title: 'Từ ngày',
              width: '130px',
              pipe: 'dd/MM/yyyy'
            },
            {
              field: 'TODATE',
              title: 'Đến ngày',
              width: '130px',
              pipe: 'dd/MM/yyyy'
            },
            {
              field: 'REGTYPE',
              title: 'Loại đăng ký',
              width: '130px',
            },
            {
              field: 'FROMHOUR_TOHOUR',
              title: 'Chi tiết đăng ký',
              width: '170px',
            },
            {
              field: 'TOTALHOUR',
              title: 'Tổng số phút',
              width: '120px',
            },
            {
              field: 'REMARK',
              title: 'Lý do',
              width: '170px',
            },
            {
              field: 'NOTE',
              title: 'Ghi chú',
              width: '170px',
            },
            {
              field: 'TIMECREATE',
              title: 'Ngày duyệt',
              width: '130px',
              pipe: 'dd/MM/yyyy'
            }
          ];
        }
        break;
      case PER_SCREEN.EXPLAIN:
        if (this.tabIndex === 0) {
          this.dataTable.columns = [
            {
              field: 'CHECKBOX',
              align: 'center'
            },
            {
              field: 'EMPLOYEE_CODE',
              title: 'Mã nhân viên',
              width: '130px',
              align: 'left'
            },
            {
              field: 'EMPLOYEENAME',
              title: 'Họ tên',
              width: '130px',
            },
            {
              field: 'TIMECREATE',
              title: 'Ngày đăng ký',
              width: '130px',
              pipe: 'dd/MM/yyyy'
            },
            {
              field: 'WORKINGDAY',
              title: 'Ngày giải trình',
              width: '130px',
              pipe: 'dd/MM/yyyy'
            },
            {
              field: 'FROMHOUR',
              title: 'Giờ GT vào',
              width: '130px',
              pipe: 'HH:mm'
            },
            {
              field: 'TOHOUR',
              title: 'Giờ GT ra',
              width: '130px',
              pipe: 'HH:mm'
            },
            {
              field: 'MANUAL_CODE',
              title: 'Công giải trình',
              width: '170px',
            },
            {
              field: 'NOTE',
              title: 'Ghi chú',
              width: '170px',
            },
            {
              field: 'STATUS',
              title: 'Trạng thái',
              width: '170px',
            }
          ];
        }
        if (this.tabIndex > 0) {
          this.dataTable.columns = [
            {
              field: 'EMPLOYEE_CODE',
              title: 'Mã nhân viên',
              width: '130px',
              align: 'left'
            },
            {
              field: 'EMPLOYEENAME',
              title: 'Họ tên',
              width: '130px',
            },
            {
              field: 'TIMECREATE',
              title: 'Ngày đăng ký',
              width: '130px',
              pipe: 'dd/MM/yyyy'
            },
            {
              field: 'WORKINGDAY',
              title: 'Ngày giải trình',
              width: '130px',
              pipe: 'dd/MM/yyyy'
            },
            {
              field: 'FROMHOUR',
              title: 'Giờ GT vào',
              width: '130px',
              pipe: 'HH:mm'
            },
            {
              field: 'TOHOUR',
              title: 'Giờ GT ra',
              width: '130px',
              pipe: 'HH:mm'
            },
            {
              field: 'MANUAL_CODE',
              title: 'Công giải trình',
              width: '170px',
            },
            {
              field: 'REMARK',
              title: 'Lý do',
              width: '170px',
            },
            {
              field: 'NOTE',
              title: 'Ghi chú',
              width: '170px',
            }
          ];
        }
        break;
      default:
        break;
    }
  }
}
