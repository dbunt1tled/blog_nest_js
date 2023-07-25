import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../../../user/enums/role';
import { ROLES_KEY } from '../roles';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly i18: I18nService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    const check = requiredRoles.some((role) => user?.role?.includes(role));
    if (!check) {
      throw new ForbiddenException(
        this.i18.t('app.alert.access_denied', {
          lang: I18nContext.current().lang,
        }),
      );
    }
    return check;
  }
}
