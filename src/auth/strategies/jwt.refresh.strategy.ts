import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../../user/user.service';
import { JwtPayload } from './jwt.payload';
import { TokenType } from './token.type';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private userService: UserService,
    private readonly i18nService: I18nService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET_REFRESH'),
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
