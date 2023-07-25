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

    let roleFilter = undefined;
    if (this.filter.role !== undefined) {
      if (isArray(this.filter.role)) {
        roleFilter = { in: this.filter.role };
      } else {
        roleFilter = this.filter.role;
      }
    }

    let statusFilter = undefined;
    if (this.filter.status !== undefined) {
      if (isArray(this.filter.status)) {
        statusFilter = { in: this.filter.status };
      } else {
        statusFilter = this.filter.status;
      }
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
        role: roleFilter,
        status: statusFilter,
      },
    };
  }
}
