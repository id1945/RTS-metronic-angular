import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/_metronic/shared/http/api.service';
import { Columns, DataTable } from 'src/app/_metronic/shared/shared/models/dataTable';
import swal from 'sweetalert';

// Tree setup - start
import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { NzTreeFlatDataSource, NzTreeFlattener } from 'ng-zorro-antd/tree-view';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmInputBasicComponent } from 'src/app/_metronic/shared/shared/components/confirm-input-basic/confirm-input-basic.component';
import { numberId, scrollEl } from 'src/app/_metronic/shared/shared/common/helper';
import { Permission } from '../../detail-kpi-parts.component';
interface FoodNode {
  name: string;
  disabled?: boolean;
  children?: FoodNode[];
  id: number;
  meta?: any;
  type?: string;
}
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
  disabled: boolean;
  id: number;
  meta?: any;
  type?: string;
}
// Tree setup - end

@Component({
  selector: 'app-e-plan-list',
  templateUrl: './e-plan-list.component.html',
  styleUrls: ['./e-plan-list.component.scss'],
  exportAs: 'plan'
})
export class EPlanListComponent implements OnInit {

  @ViewChild('confirmAccept') confirmAccept: ConfirmInputBasicComponent;
  @ViewChild('confirmReject') confirmReject: ConfirmInputBasicComponent;

  // Table
  public dataTable: DataTable<any> = {
    items: [],
    columns: [] as Columns[],
    columns2: [] as Columns[],
    isActive: true
  };

  @Input() id: string;
  @Input() permission: Permission;

  // Tree function - start
  private transformer = (node: FoodNode, level: number): ExampleFlatNode => ({
    expandable: !!node.children && node.children.length > 0,
    name: node.name,
    level,
    disabled: !!node.disabled,
    meta: node.meta,
    id: node.id,
    type: node.type,
  });
  public selectListSelection = new SelectionModel<ExampleFlatNode>();
  public treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level,
    node => node.expandable
  );
  public treeFlattener = new NzTreeFlattener(
    this.transformer,
    node => node.level,
    node => node.expandable,
    node => node.children,
  );
  public dataSource = new NzTreeFlatDataSource(this.treeControl as any, this.treeFlattener);
  public hasChild = (_: number, node: ExampleFlatNode): boolean => node.expandable;
  public treeData: any[] = [];
  public expandDescendants() {
    this.treeControl.dataNodes.forEach(node => this.treeControl.toggleDescendants(node));
  }
  private idCreateDraft: number;
  // Tree function - end

  public showHideColumnTienDoThucHienCongViec = true;

  constructor(
    private api: ApiService,
    private translate: TranslateService
  ) {
    // Table config title and field
    this.dataTable.columns = [
      {
        field: 'stt',
        title: 'STT',
        width: '50px',
        rowspan: "2",
        colspan: "1",
        isActive: true,
        align: 'center',
        stickyL: true,
      },
      {
        field: 'noiDungCongViec',
        title: 'Danh sách công việc của mục tiêu nhỏ',
        width: '300px',
        rowspan: "2",
        colspan: "1",
        isActive: true,
        align: 'left',
        stickyL: true,
      },
      {
        field: 'tieuChiDanhGia',
        title: 'Tiêu chí đánh giá mức độ hoàn thành của công việc',
        width: '300px',
        rowspan: "2",
        colspan: "1",
        isActive: true,
        align: 'left',
      },
      {
        field: 'taiLieuDauRa',
        title: 'Tài liêu đầu ra của giai đoạn',
        width: '300px',
        rowspan: "2",
        colspan: "1",
        isActive: true,
        align: 'left',
      },
      {
        field: 'tienDoThucHienCongViec',
        title: 'Tiến độ thực hiện công việc',
        width: '250px',
        rowspan: "1",
        colspan: "12",
        align: 'center',
        isActive: true
      },
      {
        field: 'nguoiPhuTrachDisplays',
        width: '200px',
        title: 'Người phụ trách',
        rowspan: "2",
        colspan: "1",
        align: 'center',
        isActive: true
      },
      {
        field: 'ghiChu',
        title: 'Ghi chú',
        width: '40px',
        rowspan: "2",
        colspan: "1",
        align: 'center',
        isActive: true
      },
      {
        field: 'raSoat',
        title: 'Rà soát',
        width: '100px',
        rowspan: "2",
        colspan: "1",
        align: 'center',
        isActive: true
      },
      {
        field: 'yKienNguoiPheDuyet',
        title: 'Ý kiến người phê duyệt',
        width: '200px',
        rowspan: "2",
        colspan: "1",
        isActive: true
      },
      {
        field: 'thaoTac',
        title: 'Thao tác',
        width: '100px',
        rowspan: "2",
        colspan: "1",
        isActive: true,
        stickyR: true,
        align: 'center',
      },
    ];

    this.dataTable.columns2 = [
      {
        field: 'thang1',
        title: 'T1',
        width: '40px',
        rowspan: "1",
        colspan: "1",
        align: 'center',
        isActive: true,
      },
      {
        field: 'thang2',
        title: 'T2',
        width: '40px',
        rowspan: "1",
        colspan: "1",
        align: 'center',
        isActive: true
      },
      {
        field: 'thang3',
        title: 'T3',
        width: '40px',
        rowspan: "1",
        colspan: "1",
        align: 'center',
        isActive: true
      },
      {
        field: 'thang4',
        title: 'T4',
        width: '40px',
        rowspan: "1",
        colspan: "1",
        align: 'center',
        isActive: true
      },
      {
        field: 'thang5',
        title: 'T5',
        width: '40px',
        rowspan: "1",
        colspan: "1",
        align: 'center',
        isActive: true
      },
      {
        field: 'thang6',
        title: 'T6',
        width: '40px',
        rowspan: "1",
        colspan: "1",
        align: 'center',
        isActive: true
      },
      {
        field: 'thang7',
        title: 'T7',
        width: '40px',
        rowspan: "1",
        colspan: "1",
        align: 'center',
        isActive: true
      },
      {
        field: 'thang8',
        title: 'T8',
        width: '40px',
        rowspan: "1",
        colspan: "1",
        align: 'center',
        isActive: true
      },
      {
        field: 'thang9',
        title: 'T9',
        width: '40px',
        rowspan: "1",
        colspan: "1",
        align: 'center',
        isActive: true
      },
      {
        field: 'thang10',
        title: 'T10',
        width: '40px',
        rowspan: "1",
        colspan: "1",
        align: 'center',
        isActive: true
      },
      {
        field: 'thang11',
        title: 'T11',
        width: '40px',
        rowspan: "1",
        colspan: "1",
        align: 'center',
        isActive: true
      },
      {
        field: 'thang12',
        title: 'T12',
        width: '40px',
        rowspan: "1",
        colspan: "1",
        align: 'center',
        isActive: true
      },
    ];
  }

  ngOnInit(): void {
    this.getList();
    this.onResizeStickyMobile();
  }

  public getList() {
    this.api.get('/api/kpimuctieu-nam-bophan-detail/list-ke-hoach-cong-viec', { KPIMucTieuNamBoPhanId: this.id }).subscribe(res => {
      if (res) {
        this.dataTable.items = res?.items;
        // Tree data
        this.mapTreeData(res);
      }
    }, err => {
      this.api.errorMessage(err);
    })
  }

  // Tree data
  private mapTreeData(res) {
    this.treeData = res?.items?.map(m => {
      // Root id
      const rootId = m?.kpiNhomTieuChiId; // kpiNhomTieuChiId
      // Level 1 
      const child_01 = (item) => {
        return item?.items?.map(m => ({
          id: m?.kpiKeHoachCongViecId, // kpiKeHoachCongViecId
          name: m?.noiDungMucTieuNho,
          children: child_01(m),
          // =================
          meta: { kpiNhomTieuChiId: rootId, parent: item, ...m }
        }));
      }
      // Level 0
      const parent: FoodNode = {
        id: rootId,
        name: m?.mucTieu,
        children: child_01(m),
        // ==================
        meta: { kpiNhomTieuChiId: rootId, ...m }
      }
      return parent;
    });
    // Update tree
    this.dataSource.setData(this.treeData);
    // Expand all
    this.treeControl.expandAll();
  }

  public onAddTreeLevel(node) {
    this.idCreateDraft = numberId();
    const children = (children, item) => {
      const clone = [...children];
      clone.unshift({
        id: this.idCreateDraft,
        type: 'draft',
        name: '',
        meta: item?.meta
      });
      return clone;
    }
    let dataById = [];
    let treeData = [...this.treeData];
    switch (node?.level) {
      case 0:
        dataById = treeData.map(m => ({ ...m, children: (m.id === node?.meta?.kpiNhomTieuChiId) ? children(m.children, m) : m.children }));
        break;
      default:
        const convert = (c) => c?.children.map(m => ({ ...m, children: (m.id === node?.meta?.kpiKeHoachCongViecId) ? children(m.children, m) : convert(m) }));
        dataById = treeData.map(m => ({ ...m, children: (m.id === node?.meta?.kpiNhomTieuChiId) ? convert(m) : m.children }));
        break;
    }
    // Update tree
    dataById?.length && this.dataSource.setData(dataById);
    // Expand all
    dataById?.length && this.treeControl.expandAll();
    // Focus & scroll to elment
    scrollEl(document.getElementById(this.idCreateDraft?.toString()), 500, true);
  }

  public onDeleteTreeLevelDraft(node) {
    let dataById = [];
    let treeData = [...this.treeData];
    switch (node?.level) {
      case 0:
        dataById = treeData.map(m => (m.id === node?.idParent) ? ({ ...m, children: m.children.filter(f => f.id != node.id) }) : m);
        break;
      default:
        dataById = treeData.map(m => (m.id === node?.idParent) ? ({ ...m, children: m.children.filter(f => f.id != node.id) }) : m);
        break;
    }
    // Update tree
    dataById?.length && this.dataSource.setData(dataById);
    // Expand all
    dataById?.length && this.treeControl.expandAll();
  }

  /**
   * KPIKeHoachCongViecId
   * @param node 
   */
  public onAddKpiKeHoachCongViec(node): void {
    if (node?.name) {
      let url, params, msgOK, msgErr;
      if (node?.level === 1) {
        params = {
          kpiNhomTieuChiId: node?.meta?.kpiNhomTieuChiId,
          noiDungMucTieuNho: node?.name
        };
      } else {
        params = {
          kpiKeHoachCongViecParentId: node?.meta?.kpiKeHoachCongViecId,
          noiDungMucTieuNho: node?.name
        };
      }
      // Switch mode
      if (this.idCreateDraft === node.id) {
        // Create
        url = '/api/kpimuctieu-nam-bophan-create/ke-hoach-cong-viec';
        msgOK = 'Thêm kế hoạch thành công!';
        msgErr = 'Thêm kế hoạch không thành công!';
      } else {
        // Edit
        url = '/api/kpimuctieu-nam-bophan-update/ke-hoach-cong-viec';
        msgOK = 'Cập nhật kế hoạch thành công!';
        msgErr = 'Cập nhật kế hoạch không thành công!';
      }
      // Request
      this.api.post(url, params).subscribe((res: any) => {
        if (res?.isSuccess) {
          swal({
            icon: "success",
            title: msgOK,
            buttons: {
              ok: this.translate.instant('COMMON.btn.close'),
            },
          } as any).then(() => {
            this.getList();
          });
        } else {
          this.api.errorMessage(msgErr);
        }
      }, err => {
        this.api.errorMessage(err);
      });
    } else {
      this.api.errorMessage('Mục tiêu là bắt buộc!');
    }
  }

  /**
   * KPIKeHoachCongViecId
   * @param id 
   */
  public onDeleteKpiKeHoachCongViec(id): void {
    id && this.api.delete(`api/kpimuctieu-nam-bophan-delete/ke-hoach-cong-viec?KPIKeHoachCongViecId=${id}`)
      .subscribe((res: any) => {
        if (res?.isSuccess) {
          swal({
            icon: "success",
            title: "Xoá KPI kế hoạch công việc thành công!",
            buttons: {
              ok: this.translate.instant('COMMON.btn.close'),
            },
          } as any).then(() => {
            this.getList();
          });
        } else {
          this.api.errorMessage("Xoá KPI kế hoạch công việc không thành công!");
        }
      }, err => {
        this.api.errorMessage(err);
      });
  }

  /**
   * KPIKeHoachCongViecChiTietId
   * @param id 
   */
  public onDeleteKpiKeHoachCongViecChiTiet(id): void {
    id && this.api.delete(`/api/kpimuctieu-nam-bophan-delete/ke-hoach-cong-viec-chi-tiet?KPIKeHoachCongViecChiTietId=${id}`)
      .subscribe((res: any) => {
        if (res?.isSuccess) {
          swal({
            icon: "success",
            title: "Xoá KPI kế hoạch công việc chi tiết thành công!",
            buttons: {
              ok: this.translate.instant('COMMON.btn.close'),
            },
          } as any).then(() => {
            this.getList();
          });
        } else {
          this.api.errorMessage("Xoá KPI kế hoạch công việc chi tiết không thành công!");
        }
      }, err => {
        this.api.errorMessage(err);
      });
  }

  public onSubmitAccept(e) {
    const params = {
      kpiKeHoachCongViecChiTietId: e?.meta?.kpiKeHoachCongViecChiTietId,
      noiDung: e?.content
    }
    this.api.post('/api/kpimuctieu-nam-bophan-create/ra-soat-ke-hoach-cong-viec-chi-tiet-phe-duyet', params).subscribe(res => {
      if (res?.isSuccess) {
        // Message ok
        swal({
          icon: 'success',
          title: 'Duyệt thành công!',
          buttons: {
            ok: this.translate.instant('COMMON.btn.close'),
          },
        } as any).then(() => {
          this.confirmAccept.isVisible = false;
          this.getList();
        });
      } else {
        this.api.errorMessage('Duyệt không thành công!');
      }
    }, err => this.api.errorMessage(err));
  }

  public onSubmitReject(e) {
    const params = {
      kpiKeHoachCongViecChiTietId: e?.meta?.kpiKeHoachCongViecChiTietId,
      noiDung: e?.content
    }
    this.api.post('/api/kpimuctieu-nam-bophan-create/ra-soat-ke-hoach-cong-viec-chi-tiet-tu-choi', params).subscribe(res => {
      if (res?.isSuccess) {
        // Message ok
        swal({
          icon: 'success',
          title: 'Báo cáo lại Mục tiêu - KHCV - KPI thành công!',
          buttons: {
            ok: this.translate.instant('COMMON.btn.close'),
          },
        } as any).then(() => {
          this.confirmReject.isVisible = false;
          this.getList();
        });
      } else {
        this.api.errorMessage('Báo cáo lại Mục tiêu - KHCV - KPI không thành công!');
      }
    }, err => this.api.errorMessage(err));
  }

  /**
   * Scale table 
   * @param node 
   * @returns 
   */
  public getCalcScale(node) {
    const offsetWidth = document.getElementById("kt_header")?.offsetWidth - 156;
    return offsetWidth - (23 * node.level);
  }

  public onChangeShowHideColumn(item: Columns) {
    // Xoá cột tienDoThucHienCongViec && tất cả các cột nhỏ
    if (item.field === 'tienDoThucHienCongViec') {
      this.showHideColumnTienDoThucHienCongViec = item.isActive;
    }
  }

  /**
   * active/inactive
   * Sticky table column
   */
  public onResizeStickyMobile() {
    const offsetWidth = document.getElementById("kt_header")?.offsetWidth;
    this.dataTable.columns = this.dataTable.columns.map(m => {
      // sticky left
      if (m?.stickyL === true || m?.stickyL === false) {
        return { ...m, stickyL: offsetWidth > 1200 };
      }
      // sticky right
      if (m?.stickyR === true || m?.stickyR === false) {
        return { ...m, stickyR: offsetWidth > 1000 };
      }
      return m;
    });
  }

  /**
   * Lock/Unlock
   * @param item 
   */
  public onLockUnlock(item, meta): void {
    const params = {
      kpiNhomTieuChiId: meta?.kpiNhomTieuChiId,
      isLock: !item?.isLock, // false: mở khoá, true: khoá
    };
    this.api.post('/api/kpimuctieu-nam-bophan-update/ke-hoach-cong-viec-chi-tiet-lock-unlock', params).subscribe((res: any) => {
      if (res?.isSuccess) {
        swal({
          icon: "success",
          title: item?.isLock ? 'Mở khoá bản ghi thành công!' : 'Khoá bản ghi thành công!',
          buttons: {
            ok: this.translate.instant('COMMON.btn.close'),
          },
        } as any).then(() => {
          this.getList();
        });
      } else {
        this.api.errorMessage(item?.isLock ? 'Mở khoá bản ghi không thành công!' : 'Khoá bản ghi không thành công!');
      }
    }, err => {
      this.api.errorMessage(err);
    });
  }

  /**
   * Download file
   * @param id 
   * @param fileName 
   */
  public onDownloadFile(id, fileName) {
    const header = {
      observe: 'response',
      responseType: 'blob' as 'json',
    };
    this.api.get(`/api/kpimuctieu-nam-bophan-misc/tai-lieu-goc-ke-hoach-cong-viec-chi-tiet`, { KPIKeHoachCongViecChiTietId: id, TenFile: fileName }, header).subscribe((res: any) => {
      if (res) {
        this.api.downloadFileFromBlob(res);
      }
    }, err => {
      this.api.errorMessage(err);
    });
  }

  /**
   * Chỉ load item bị thay đổi
   * @param index 
   * @returns 
   */
  public trackByFn(index: number) {
    return index;
  }
}
