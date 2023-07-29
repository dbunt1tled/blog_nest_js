import { UFilter } from '../../user/dto/user.filter';
import { Pagination } from '../requests/pagination/pagination';
import { FilterCondition } from './filterCondition';

export abstract class Filter {
  constructor(public readonly pagination?: Pagination) {}

  abstract build(limit: number | undefined): FilterCondition;
}
