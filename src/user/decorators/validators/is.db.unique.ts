import {
  registerDecorator, ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator';
import { UserService } from '../../user.service';
import { UserFilter } from '../../user.filter';
import { Injectable } from '@nestjs/common';
import { UFilter } from '../../dto/user.filter.interface';
import { ORMService } from '../../../connectors/orm/o-r-m.service';
import { PrismaClient } from '@prisma/client';

@Injectable()
@ValidatorConstraint({ name: 'isDBUnique', async: true })
export class IsUniqueDatabase implements ValidatorConstraintInterface {
  constructor(private readonly ormService: ORMService) {}

  async validate(value: string, args: ValidationArguments) {
    const getModel = (model) => {
      const prisma = new PrismaClient();
      for (const [key, value] of Object.entries(prisma)) {
        if (typeof value == 'object' && key === model) {
          return value;
        }
      }
    };
    const [model, field, param] = args.constraints;
    const table = await getModel(model);
    const filter = { [field]: value };
    if (param !== undefined) {
      filter['NOT'] = {[param]: args.object[param]};
    }
    return table
      .findFirst({
        where: <any>filter,
        take: 1,
    }).then((user) => {
        return !user;
      });
  }
  defaultMessage(args: ValidationArguments) {
    const field = args.property;
    const value = (args.object as any)[field];
    return `${field}: ${value} already exists`;
  }
}

export function isDBUnique(
  model: string,
  field: string,
  param?: string,
  validationOptions?: ValidationOptions
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [model, field, param],
      validator: IsUniqueDatabase,
    });
  };
}
