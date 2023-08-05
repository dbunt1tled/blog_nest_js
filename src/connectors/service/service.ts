import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { ORMService } from '../orm/o-r-m.service';
import { Filter } from '../repository/filter';
import { FilterCondition } from '../repository/filterCondition';
import { Paginator } from '../requests/pagination/paginator';

@Injectable()
export class Service {
  constructor(
    protected readonly i18n: I18nService,
    protected readonly ormService: ORMService,
  ) {}

  async resultList<T>(data: T[], filter: Filter): Promise<T[] | Paginator<T>> {
    if (
      !('pagination' in filter) ||
      filter.pagination === undefined ||
      filter.pagination.page === undefined
    ) {
      return data;
    }
    const filterData = filter.build(undefined);
    filterData.orderBy = undefined;
    filterData.take = undefined;
    filterData.skip = undefined;
    const count = await this.ormService.user.count(filterData);
    return <Paginator<T>>{
      data: data,
      total: data.length,
      page: filter.pagination.page,
      perPage: filter.pagination.limit,
      totalPage: count === 0 ? 1 : Math.ceil(count / filter.pagination.limit),
      interface: 'Paginator'
    };
  }
}
