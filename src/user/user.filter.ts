import { isArray } from 'class-validator';
import { UserFilterI } from './interfaces/user.filter.interface';

export class UserFilter {
  constructor(private readonly filter: UserFilterI) {}

  build() {
    let nameFilter = undefined;
    if (this.filter.name !== undefined) {
      nameFilter = this.filter.name;
    } else if (this.filter.nameSearch !== null) {
      nameFilter = { contains: this.filter.nameSearch };
    }

    let emailFilter = undefined;
    if (this.filter.email !== undefined) {
      emailFilter = this.filter.email;
    } else if (this.filter.emailSearch !== null) {
      emailFilter = { contains: this.filter.emailSearch };
    }

    let idFilter = undefined;
    if (this.filter.id !== undefined) {
      if (isArray(this.filter.id)) {
        idFilter = { in: this.filter.id };
      } else {
        idFilter = this.filter.id;
      }
    }

    return {
      where: {
        id: idFilter,
        email: emailFilter,
        name: nameFilter,
      },
    };
  }
}
