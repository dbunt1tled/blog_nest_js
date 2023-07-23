import { Injectable } from '@nestjs/common';
import { ORMService } from '../connectors/o-r-m.service';
import { UserFilter } from './user.filter';
import { User } from '@prisma/client';
import { UserUpdate } from './dto/UserUpdate';
import { UserCreate } from './dto/UserCreate';

@Injectable()
export class UserService {
  constructor(private readonly ormService: ORMService) {}
  create(user: UserCreate) {
    return this.ormService.user.create({
      data: {
        name: user.name,
        email: user.email,
        hash: user.hash,
        hashRt: user.hashRt,
      },
    });
  }

  update(user: UserUpdate) {
    console.log(user);
    return this.ormService.user.update({
      where: {
        id: user.userId,
      },
      data: {
        name: user.name,
        email: user.email,
        hash: user.hash,
        hashRt: user.hashRt,
      },
    });
  }

  findById(id: number) {
    return this.ormService.user.findFirst({
      where: { id: id },
    });
  }
  getById(id: number) {
    return this.ormService.user.findFirstOrThrow({
      where: { id: id },
    });
  }

  one(filter: UserFilter) {
    return this.ormService.user.findFirst(filter.build());
  }

  list(filter: UserFilter) {
    return this.ormService.user.findMany(filter.build());
  }
}
