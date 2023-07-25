import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from '../constants';
import { JwtPayload } from './jwt.payload';
import { UserService } from '../../user/user.service';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { TokenType } from './token.type';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { UserStatus } from '../../user/enums/user.status';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private userService: UserService,
    private readonly i18nService: I18nService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secretAccess,
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.userService.getById(payload.sub);
    console.log(user);
    console.log(payload);

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