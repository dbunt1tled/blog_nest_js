import { Injectable, NotFoundException } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { Paginator } from '../connectors/requests/pagination/paginator';
import { Service } from '../connectors/service/service';
import { UserCreate } from './dto/user.create';
import { UserUpdate } from './dto/user.update';
import { User } from './models/user';
import { UserFilter } from './user.filter';

@Injectable()
export class UserService extends Service {
  async create(user: UserCreate): Promise<User> {
    const u = await (<Promise<User>>this.ormService.user.create({
      data: {
        name: user.name,
        email: user.email,
        status: user.status,
        role: user.role,
        hash: user.hash,
        hashRt: user.hashRt,
        confirmedAt: user.confirmedAt,
      },
    }));
    if (u) {
      u.interface = 'Entity';
    }

    return u;
  }

  async update(user: UserUpdate): Promise<User> {
    const u = await (<Promise<User>>this.ormService.user.update({
      where: {
        id: user.id,
      },
      data: {
        name: user.name,
        email: user.email,
        status: user.status,
        role: user.role,
        hash: user.hash,
        hashRt: user.hashRt,
        confirmedAt: user.confirmedAt,
      },
    }));
    if (u) {
      u.interface = 'Entity';
    }

    return u;
  }

  async findById(id: number): Promise<User | null> {
    const user = await (<Promise<User | null>>this.ormService.user.findFirst({
      where: { id: id },
      take: 1,
    }));
    if (user) {
      user.interface = 'Entity';
    }

    return user;
  }

  async getById(id: number): Promise<User> {
    const user = await (<Promise<User>>this.ormService.user
      .findUniqueOrThrow({
        where: { id: id },
      })
      .catch(() => {
        throw new NotFoundException(
          this.i18n.t('app.alert.user_not_found', {
            lang: I18nContext.current().lang,
          }),
        );
      }));

    if (user) {
      user.interface = 'Entity';
    }

    return user;
  }

  async one(filter: UserFilter): Promise<User | null> {
    const user = await (<Promise<User | null>>(
      this.ormService.user.findFirst(filter.build(1))
    ));
    if (user) {
      user.interface = 'Entity';
    }
    return user;
  }

  async list(filter: UserFilter): Promise<User[] | Paginator<User>> {
    const filterData = filter.build();
    const users = await (<Promise<User[]>>(
      this.ormService.user.findMany(filterData)
    ));
    users.forEach((user) => {
      user.interface = 'Entity';
    });
    return await this.resultList(users, filter);
  }
}
