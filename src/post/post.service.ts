import { Global, Injectable, NotFoundException } from '@nestjs/common';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { ORMService } from '../connectors/orm/o-r-m.service';
import { Post } from './models/post';
import { PostFilter } from './post.filter';

@Global()
@Injectable()
export class PostService {
  constructor(
    private readonly i18n: I18nService,
    private readonly ormService: ORMService,
  ) {}

  findById(id: number): Promise<Post | null> {
    return <Promise<Post | null>>this.ormService.post.findFirst({
      where: { id: id },
      take: 1,
    });
  }

  getById(id: number): Promise<Post> {
    return <Promise<Post>>this.ormService.post
      .findUniqueOrThrow({
        where: { id: id },
      })
      .catch(() => {
        throw new NotFoundException(
          this.i18n.t('app.alert.post_not_found', {
            lang: I18nContext.current().lang,
          }),
        );
      });
  }

  one(filter: PostFilter) {
    return <Promise<Post | null>>(
      this.ormService.post.findFirst(filter.build(1))
    );
  }

  list(filter: PostFilter) {
    return <Promise<Post[]>>this.ormService.post.findMany(filter.build());
  }
}
