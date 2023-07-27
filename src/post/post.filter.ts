import { isArray } from 'class-validator';
import { PFilter } from './dto/post.filter';

export class PostFilter {
  constructor(private readonly filter: PFilter) {}

  build(limit: number|undefined = undefined) {
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
    if (this.filter.id !== undefined) {
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
