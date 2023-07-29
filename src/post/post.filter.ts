import { isArray } from 'class-validator';
import { Filter } from '../connectors/repository/filter';
import { FilterCondition } from '../connectors/repository/filterCondition';
import { Pagination } from '../connectors/requests/pagination/pagination';
import { PFilter } from './dto/post.filter';

export class PostFilter extends Filter {
  constructor(
    public readonly filter: PFilter,
    public readonly pagination?: Pagination,
  ) {
    super(pagination);
  }

  build(limit: number | undefined = undefined): FilterCondition {
    let titleFilter = undefined;
    if (this.filter.titleSearch !== undefined) {
      titleFilter = { contains: this.filter.titleSearch };
    }

    let statusFilter = undefined;
    if (this.filter.status !== undefined) {
      if (isArray(this.filter.status)) {
        statusFilter = { in: this.filter.status };
      } else {
        statusFilter = this.filter.status;
      }
    }

    let idFilter = undefined;
    if (this.filter.id !== undefined) {
      if (isArray(this.filter.id)) {
        idFilter = { in: this.filter.id };
      } else {
        idFilter = this.filter.id;
      }
    }

    let authorIdFilter = undefined;
    if (this.filter.authorId !== undefined) {
      if (isArray(this.filter.authorId)) {
        authorIdFilter = { in: this.filter.authorId };
      } else {
        authorIdFilter = this.filter.authorId;
      }
    }

    return {
      where: {
        id: idFilter,
        authorId: authorIdFilter,
        title: titleFilter,
        status: statusFilter,
      },
      take: limit,
    };
  }
}
