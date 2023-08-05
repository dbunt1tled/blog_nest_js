import { Injectable } from '@nestjs/common';
import { isArray } from 'class-validator';
import JSONAPISerializer from 'json-api-serializer';
import { IncludeQuery } from '../connectors/requests';
import { Paginator } from '../connectors/requests/pagination/paginator';
import userSerializer from '../user/serializers/user.serializer';
import { UserService } from '../user/user.service';
import { Post } from './models/post';
import postSerializer from './serializers/post.serializer';
import {isEntity, isPaginator} from '../connectors/helpers/helper';

@Injectable()
export class PostResponseService {
  constructor(private readonly userService: UserService) {}

  async response(
    postData: Post | Post[] | Paginator<Post>,
    query?: IncludeQuery,
  ): Promise<object> {
    const serializer: JSONAPISerializer = new JSONAPISerializer({
      convertCase: 'camelCase',
      unconvertCase: 'snake_case',
      convertCaseCacheSize: 100,
    });
    const relationships = {};
    const terms = query?.include?.split(',') ?? [];
    let data = postData;
    for (let term of terms) {
      term = term.trim();
      if (term === 'user') {
        relationships['author'] = {
          type: term,
        };
        if (isArray(postData)) {
          for (const element of postData) {
            element.author = await this.userService.getById(element.authorId);
          }
        } else if (isPaginator(postData)) {
          for (const element of postData.data) {
            element.author = await this.userService.getById(element.authorId);
          }
          data = postData.data;
        } else if (isEntity(postData)){
          postData.author = await this.userService.getById(postData.authorId);
        }
        serializer.register('user', userSerializer);
      }
    }

    postSerializer.relationships = relationships;
    postSerializer.topLevelMeta = isPaginator(postData)
        ? {
          total: postData.total,
          currentPage: postData.page,
          perPage: postData.perPage,
          totalPages: postData.totalPage,
        }
        : {};
    serializer.register('post', postSerializer);
    return await serializer.serializeAsync('post', data);
  }
}
