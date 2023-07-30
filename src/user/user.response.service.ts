import { Injectable } from '@nestjs/common';
import { isArray } from 'class-validator';
import JSONAPISerializer from 'json-api-serializer';
import { IncludeQuery } from '../connectors/requests';
import { Paginator } from '../connectors/requests/pagination/paginator';
import { Post } from '../post/models/post';
import { PostFilter } from '../post/post.filter';
import { PostService } from '../post/post.service';
import postSerializer from '../post/serializers/post.serializer';
import { User } from './models/user';
import userSerializer from './serializers/user.serializer';

@Injectable()
export class UserResponseService {
  constructor(private readonly postService: PostService) {}

  async response(
    userData: User | User[] | Paginator<User>,
    query?: IncludeQuery,
  ): Promise<object> {
    const serializer: JSONAPISerializer = new JSONAPISerializer({
      convertCase: 'camelCase',
      unconvertCase: 'snake_case',
      convertCaseCacheSize: 100,
    });
    const relationships = {};
    const terms = query?.include?.split(',') ?? [];
    let data = userData;
    for (let term of terms) {
      term = term.trim();
      if (term === 'post') {
        relationships[term] = {
          type: term,
        };
        if (isArray(userData)) {
          for (const element of userData) {
            element.post = <Post[]>await this.postService.list(
              new PostFilter({
                authorId: element.id,
              }),
            );
          }
        } else if ('data' in userData) {
          for (const element of userData.data) {
            element.post = <Post[]>await this.postService.list(
              new PostFilter({
                authorId: element.id,
              }),
            );
          }
          data = userData.data;
        } else {
          userData.post = <Post[]>await this.postService.list(
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
    return await serializer.serializeAsync('user', data);
  }
}
