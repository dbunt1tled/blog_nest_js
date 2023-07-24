import { Injectable, NotFoundException } from '@nestjs/common';
import { ORMService } from '../connectors/orm/o-r-m.service';
import { UserFilter } from './user.filter';
import { UserUpdate } from './dto/UserUpdate';
import { UserCreate } from './dto/UserCreate';
import { UserI } from './interfaces/user.interface';

@Injectable()
export class UserService {
  constructor(private readonly ormService: ORMService) {}
  create(user: UserCreate): Promise<UserI> {
    return <Promise<UserI>>this.ormService.user.create({
      data: {
        name: user.name,
        email: user.email,
        hash: user.hash,
        hashRt: user.hashRt,
      },
    });
  }

  update(user: UserUpdate): Promise<UserI> {
    return <Promise<UserI>>this.ormService.user.update({
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

  findById(id: number): Promise<UserI | null> {
    return <Promise<UserI | null>>this.ormService.user.findFirst({
      where: { id: id },
    });
  }
  getById(id: number): Promise<UserI> {
    return <Promise<UserI>>this.ormService.user
      .findUniqueOrThrow({
        where: { id: id },
      })
      .catch(() => {
        throw new NotFoundException('User not found');
      });
  }

  one(filter: UserFilter) {
    return <Promise<UserI | null>>(
      this.ormService.user.findFirst(filter.build())
    );
  }

  list(filter: UserFilter) {
    return <Promise<UserI[] | []>>this.ormService.user.findMany(filter.build());
  }
}
