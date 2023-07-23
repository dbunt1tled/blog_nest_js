import { isArray } from 'class-validator';

export class UserFilter {
  id?: number | number[];
  email?: string;
  name?: string;
  emailSearch?: string;
  nameSearch?: string;

  build() {
    let nameFilter = undefined;
    if (this.name !== undefined) {
      nameFilter = this.name;
    } else if (this.nameSearch !== null) {
      nameFilter = { contains: this.nameSearch };
    }

    let emailFilter = undefined;
    if (this.email !== undefined) {
      emailFilter = this.email;
    } else if (this.emailSearch !== null) {
      emailFilter = { contains: this.emailSearch };
    }

    let idFilter = undefined;
    if (this.id !== undefined) {
      if (isArray(this.id)) {
        idFilter = { in: this.id };
      } else {
        idFilter = this.id;
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
