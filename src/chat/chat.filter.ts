import { isArray } from 'class-validator';
import { Filter } from '../connectors/repository/filter';
import { FilterCondition } from '../connectors/repository/filterCondition';
import { Pagination } from '../connectors/requests/pagination/pagination';
import { CFilter } from './dto/chat.filter';

export class ChatFilter extends Filter {
  constructor(
    public readonly filter: CFilter,
    public readonly pagination?: Pagination,
  ) {
    super(pagination);
  }

  build(limit: number | undefined = undefined): FilterCondition {
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
      },
      take: limit,
    };
  }
}
