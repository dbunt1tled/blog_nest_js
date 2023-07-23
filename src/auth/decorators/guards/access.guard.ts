import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class AccessGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride('Public', [
      context.getHandler(),
      context.getClass,
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }
}
