import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { PaginationQuery } from './pagination.query';
import { Pagination } from './pagination';
import { isString } from 'class-validator';

@Injectable()
export class PaginationQueryTransform
  implements PipeTransform<PaginationQuery, Pagination>
{
  transform(value: PaginationQuery, metadata: ArgumentMetadata): Pagination {
    const fields = value?.sortBy
      ?.split(',')
      .filter((field) => field.trim().length > 0);
    const limit = isString(value.limit) ? Number(value.limit) : value.limit;
    const page = isString(value.page) ? Number(value.page) : value.page;
    const pagination: Pagination = {
      limit: limit ?? 10,
      page: page ?? 1,
      field: [],
    };
    if (!fields || fields.length === 0) {
      return pagination;
    }
    for (const field of fields) {
      // eslint-disable-next-line prefer-const
      let [fieldName, order] = field.split(':');
      if (!['asc', 'desc'].includes(order)) {
        order = 'desc';
      }
      pagination.field.push({ [fieldName]: <'asc' | 'desc'>order });
    }

    return pagination;
  }
}
