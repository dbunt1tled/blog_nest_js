import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './models/user';
import JSONAPISerializer from 'json-api-serializer';
import { PostService } from '../post/post.service';
import { isArray } from 'class-validator';
import { PostFilter } from '../post/post.filter';
import userSerializer from './serializers/user.serializer';
import postSerializer from '../post/serializers/post.serializer';
import { IncludeQuery } from '../connectors/requests';
import { Paginator } from '../connectors/requests/pagination/paginator';

@Injectable()
export class UserResponseService {
  constructor(private readonly postService: PostService) {}

  async response(
    userData: User | User[] | Paginator,
    query?: IncludeQuery,
  ): Promise<object> {
    const serializer: JSONAPISerializer = new JSONAPISerializer({
      convertCase: 'camelCase',
      unconvertCase: 'snake_case',
      convertCaseCacheSize: 100,
    });
    const relationships = {};
    const terms = query?.include?.split(',') ?? [];
    for (let term of terms) {
      term = term.trim();
      if (term === 'post') {
        relationships[term] = {
          type: term,
        };

        if (isArray(userData)) {
          for (const element of userData) {
            element.post = await this.postService.list(
              new PostFilter({
                authorId: element.id,
              }),
            );
          }
        } else if ('data' in userData) {
          for (const element of userData.data) {
            element.post = await this.postService.list(
              new PostFilter({
                authorId: element.id,
              }),
            );
          }
        } else if ('post' in userData) {
          userData.post = await this.postService.list(
            new PostFilter({
              authorId: userData.id,
            }),
          );
        }
        serializer.register('post', postSerializer);
      }
    }
    userSerializer.relationships = relationships;
    serializer.register('user', userSerializer);
    return await serializer.serializeAsync('user', userData);
  }
}
