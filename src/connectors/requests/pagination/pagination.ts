export interface Pagination {
  limit: number;
  page?: number;
  field: { [key: string]: string }[];
}
