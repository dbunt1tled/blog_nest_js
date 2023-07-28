export interface Paginator {
  total: number;
  page: number;
  perPage: number;
  totalPage: number;
  data: Array<any>;
}