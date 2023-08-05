import { isArray } from 'class-validator';
import { UFilter } from './dto/user.filter';
import { PaginationQuery } from '../connectors/requests';
import { Pagination } from '../connectors/requests/pagination/pagination';
import { Filter } from '../connectors/repository/filter';
import { FilterCondition } from '../connectors/repository/filterCondition';

export class UserFilter extends Filter{
  constructor(
    public readonly filter: UFilter,
    public readonly pagination?: Pagination,
  ) {
    super(pagination);
  }
  build(limit: number | undefined = undefined): FilterCondition {
    let take: number = limit;
    let skip = undefined;
    let orderBy = undefined;
    let nameFilter = undefined;
    if (this.filter?.name !== undefined) {
      nameFilter = this.filter.name;
    } else if (this.filter.nameSearch !== null) {
      nameFilter = { contains: this.filter.nameSearch };
    }

    let emailFilter = undefined;
    if (this.filter?.email !== undefined) {
      emailFilter = this.filter.email;
    } else if (this.filter.emailSearch !== null) {
      emailFilter = { contains: this.filter.emailSearch };
    }

    let roleFilter = undefined;
    if (this.filter?.role !== undefined) {
      if (isArray(this.filter.role)) {
        roleFilter = { in: this.filter.role };
      } else {
        roleFilter = this.filter.role;
      }
    }

    let statusFilter = undefined;
    if (this.filter?.status !== undefined) {
      if (isArray(this.filter.status)) {
        statusFilter = { in: this.filter.status };
      } else {
        statusFilter = this.filter.status;
      }
    }

    let idFilter = undefined;
    if (this.filter?.id !== undefined) {
      if (isArray(this.filter.id)) {
        idFilter = { in: this.filter.id };
      } else {
        idFilter = this.filter.id;
      }
    }

    if (this.pagination) {
      take = this.pagination.limit;
      skip = (this.pagination.page - 1) * this.pagination.limit;
      if (
        this.pagination.field &&
        Object.keys(this.pagination.field).length > 0
      ) {
        orderBy = this.pagination.field;
      }
    }
    return <FilterCondition>{
      where: {
        id: idFilter,
        email: emailFilter,
        name: nameFilter,
        role: roleFilter,
        status: statusFilter,
      },
      skip: skip,
      take: take,
      orderBy: orderBy,
    };
  }
}
