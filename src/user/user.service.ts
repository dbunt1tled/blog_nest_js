import { Injectable, NotFoundException } from '@nestjs/common';
import { ORMService } from '../connectors/orm/o-r-m.service';
import { UserFilter } from './user.filter';
import { UserUpdate } from './dto/user.update';
import { UserCreate } from './dto/user.create';
import { User } from './models/user';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Injectable()
export class UserService {
  constructor(
    private readonly i18n: I18nService,
    private readonly ormService: ORMService,
  ) {}
  create(user: UserCreate): Promise<User> {
    return <Promise<User>>this.ormService.user.create({
      data: {
        name: user.name,
        email: user.email,
        status: user.status,
        role: user.role,
        hash: user.hash,
        hashRt: user.hashRt,
        confirmedAt: user.confirmedAt,
      },
    });
  }

  update(user: UserUpdate): Promise<User> {
    return <Promise<User>>this.ormService.user.update({
      where: {
        id: user.userId,
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
    });
  }

  findById(id: number): Promise<User | null> {
    return <Promise<User | null>>this.ormService.user.findFirst({
      where: { id: id },
      take: 1,
    });
  }
  getById(id: number): Promise<User> {
    return <Promise<User>>this.ormService.user
      .findUniqueOrThrow({
        where: { id: id },
      })
      .catch(() => {
        throw new NotFoundException(
          this.i18n.t('app.alert.user_not_found', {
            lang: I18nContext.current().lang,
          }),
        );
      });
  }

  one(filter: UserFilter) {
    return <Promise<User | null>>(
      this.ormService.user.findFirst(filter.build(1))
    );
  }

  list(filter: UserFilter) {
    return <Promise<User[] | []>>this.ormService.user.findMany(filter.build());
  }
}
