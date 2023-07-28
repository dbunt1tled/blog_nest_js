import { PaginationQuery } from './pagination.query';

export interface PaginationRequest {
  limit?: number;
  page?: number;
  sortBy?: PaginationQuery;
}
