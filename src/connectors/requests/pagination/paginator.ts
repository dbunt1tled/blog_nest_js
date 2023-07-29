export interface Paginator<T> {
  total: number;
  page: number;
  perPage: number;
  totalPage: number;
  data: Array<T>;
  interface?: 'Paginator';
}