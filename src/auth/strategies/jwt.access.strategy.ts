import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserStatus } from '../../user/enums/user.status';
import { UserService } from '../../user/user.service';
import { JwtPayload } from './jwt.payload';
import { TokenType } from './token.type';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private userService: UserService,
    private readonly i18nService: I18nService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET_ACCESS'),
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.userService.getById(payload.sub);
    if (
      user.status !== UserStatus.ACTIVE ||
      payload.type !== TokenType.ACCESS ||
      user.hashRt !== payload.session
    ) {
      throw new ForbiddenException(
        this.i18nService.t('app.alert.access_denied', {
          lang: I18nContext.current().lang,
        }),
      );
    }
    return payload;
  }
}
