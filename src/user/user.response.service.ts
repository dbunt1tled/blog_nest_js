import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './models/user';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { UserService } from './user.service';
import JSONAPISerializer from 'json-api-serializer';
import { PostService } from '../post/post.service';
import { isArray } from 'class-validator';
import { PostFilter } from '../post/post.filter';
import userSerializer from './serializers/user.serializer';
import postSerializer from '../post/serializers/post.serializer';
import { IncludeQuery } from '../connectors/requests';

@Injectable()
export class UserResponseService {
  constructor(private readonly postService: PostService) {}

  async response(
    user: User | User[],
    query?: IncludeQuery,
  ): Promise<object> {
    const serializer: JSONAPISerializer = new JSONAPISerializer({
      convertCase: 'camelCase',
      unconvertCase: 'snake_case',
      convertCaseCacheSize: 100,
    });
    console.log(query);
    const relationships = {};
    const terms = query?.include?.split(',') ?? [];
    for (let term of terms) {
      term = term.trim();
      if (term === 'post') {
        relationships[term] = {
          type: term,
        };
        if (isArray(user)) {
          for (const element of user) {
            element.post = await this.postService.list(
              new PostFilter({
                authorId: element.id,
              }),
            );
          }
        } else {
          user.post = await this.postService.list(
            new PostFilter({
              authorId: user.id,
            }),
          );
        }
        serializer.register('post', postSerializer);
      }
    }
    userSerializer.relationships = relationships;
    serializer.register('user', userSerializer);
    return await serializer.serializeAsync('user', user);
  }
}
