import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from '../constants';
import { Request } from 'express';
import { JwtPayload } from './jwt.payload';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { TokenType } from './token.type';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private userService: UserService,
    private readonly i18nService: I18nService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secretRefresh,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload) {
    const refreshToken = req.get('authorization').replace('Bearer', '').trim();
    const user = await this.userService.getById(payload.sub);
    if (payload.type === TokenType.ACCESS && user.hashRt !== payload.session) {
      throw new ForbiddenException(
        this.i18nService.t('app.alert.access_denied', {
          lang: I18nContext.current().lang,
        }),
      );
    }
    return { ...payload, refreshToken };
  }
}