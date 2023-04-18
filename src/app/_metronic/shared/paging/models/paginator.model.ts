export const PageSizes = [10, 20, 30, 40, 50];

export interface IPaginatorState {
  page: number;
  pageSize: number;
  totalRecord: number;
  recalculatePaginator(total: number): IPaginatorState;
}

export class PaginatorState implements IPaginatorState {
  page = 1;
  pageSize = PageSizes[2];
  totalRecord = 0;
  pageSizes: number[] = [];

  recalculatePaginator(total: number): PaginatorState {
    this.totalRecord = total;
    return this;
  }
}

export interface IPaginatorView {
  paginator: PaginatorState;
  ngOnInit(): void;
  paginate(paginator: PaginatorState): void;
}
