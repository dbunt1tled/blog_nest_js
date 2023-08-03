import { Global, Injectable, NotFoundException } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { Paginator } from '../connectors/requests/pagination/paginator';
import { Service } from '../connectors/service/service';
import { UserCreate } from '../user/dto/user.create';
import { UserUpdate } from '../user/dto/user.update';
import { User } from '../user/models/user';
import { PostCreate } from './dto/post.create';
import { Post } from './models/post';
import { PostFilter } from './post.filter';
import { PostUpdate } from './dto/post.update';

@Global()
@Injectable()
export class PostService extends Service {
  async findById(id: number): Promise<Post | null> {
    const post = await (<Promise<Post | null>>this.ormService.post.findFirst({
      where: { id: id },
      take: 1,
    }));
    if (post) {
      post.interface = 'Entity';
    }

    return post;
  }

  async getById(id: number): Promise<Post> {
    const post = await (<Promise<Post>>this.ormService.post
      .findUniqueOrThrow({
        where: { id: id },
      })
      .catch(() => {
        throw new NotFoundException(
          this.i18n.t('app.alert.post_not_found', {
            lang: I18nContext.current().lang,
          }),
        );
      }));
    post.interface = 'Entity';

    return post;
  }

  async one(filter: PostFilter) {
    const post = await (<Promise<Post | null>>(
      this.ormService.post.findFirst(filter.build(1))
    ));
    if (post) {
      post.interface = 'Entity';
    }

    return post;
  }

  async list(filter: PostFilter): Promise<Post[] | Paginator<Post>> {
    const filterData = filter.build();
    const posts = <Post[]>await this.ormService.post.findMany(filter.build());
    posts.forEach((post) => {
      post.interface = 'Entity';
    });
    return await this.resultList(posts, filter);
  }

  async create(post: PostCreate): Promise<Post> {
    const p = await (<Promise<Post>>this.ormService.post.create({
      data: {
        title: post.title,
        content: post.content,
        status: post.status,
        img: post.img,
        authorId: post.authorId,
      },
    }));
    if (p) {
      p.interface = 'Entity';
    }

    return p;
  }

  async update(post: PostUpdate): Promise<Post> {
    let p: Post = await this.getById(post.id);
    p = await (<Promise<Post>>this.ormService.post.update({
      where: {
        id: post.id,
      },
      data: {
        title: post.title,
        content: post.content,
        status: post.status,
        img: post.img,
        authorId: p.authorId,
      },
    }));
    if (p) {
      p.interface = 'Entity';
    }

    return p;
  }
}
