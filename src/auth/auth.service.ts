import {
  ForbiddenException,
  Global,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { uid } from 'uid';
import { Role } from '../user/enums/role';
import { UserStatus } from '../user/enums/user.status';
import { User } from '../user/models/user';
import { UserFilter } from '../user/user.filter';
import { UserService } from '../user/user.service';
import { Auth } from './dto/auth';
import { SignUp } from './dto/sign-up';
import { Tokens } from './dto/tokens';
import { JwtPayload } from './strategies/jwt.payload';
import { TokenType } from './strategies/token.type';

@Global()
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly i18n: I18nService,
    private readonly configService: ConfigService,
  ) {}

  async tokens(user: User): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: user.id,
          email: user.email,
          type: TokenType.ACCESS,
          role: [user.role],
          session: user.hashRt,
        },
        {
          expiresIn: 60 * 30,
          secret: this.configService.get('JWT_SECRET_ACCESS'),
        },
      ),
      this.jwtService.signAsync(
        {
          sub: user.id,
          email: user.email,
          type: TokenType.ACCESS,
          role: [user.role],
          session: user.hashRt,
        },
        {
          expiresIn: 60 * 60 * 24 * 30,
          secret: this.configService.get('JWT_SECRET_REFRESH'),
        },
      ),
    ]);
    return { accessToken: accessToken, refreshToken: refreshToken };
  }

  async signup(auth: SignUp) {
    const user = await this.userService.one(
      new UserFilter({ email: auth.email }),
    );
    if (user) {
      throw new UnprocessableEntityException(
        this.i18n.t('app.alert.user_email_exists', {
          args: { email: auth.email },
          lang: I18nContext.current().lang,
        }),
      );
    }
    const hash = await argon2.hash(auth.password);
    return this.userService.create({
      name: auth.name,
      email: auth.email,
      status: UserStatus.PENDING,
      role: Role.USER,
      hash: hash,
      hashRt: uid(21),
    });
  }

  async login(auth: Auth): Promise<Tokens> {
    let user = await this.userService.one(
      new UserFilter({ email: auth.email }),
    );
    if (!user) {
      throw new NotFoundException(
        this.i18n.t('app.alert.user_not_found', {
          lang: I18nContext.current().lang,
        }),
      );
    }
    const compare: boolean = await argon2.verify(user.hash, auth.password);
    if (!compare) {
      throw new ForbiddenException(
        this.i18n.t('app.alert.user_password_mismatch', {
          lang: I18nContext.current().lang,
        }),
      );
    }

    user = await this.userService.update({
      id: user.id,
      hashRt: uid(21),
    });
    return this.tokens(user);
  }

  async logout(userId: number) {
    await this.userService.update({
      id: userId,
      hashRt: uid(21),
    });
  }

  async refresh(userId: number): Promise<Tokens> {
    let user = await this.userService.getById(userId);
    user = await this.userService.update({
      id: user.id,
      hashRt: uid(21),
    });
    return this.tokens(user);
  }

  async confirmToken(userId: number) {
    const user = await this.userService.getById(userId);
    return this.jwtService.signAsync(
      {
        sub: user.id,
        email: user.email,
        type: TokenType.CONFIRM_EMAIL,
        session: user.hashRt,
      },
      {
        expiresIn: '1d',
        secret: this.configService.get('JWT_SECRET_ACCESS'),
      },
    );
  }

  decodeToken(token: string, checkExpiry = true): JwtPayload {
    if (!checkExpiry) {
      const t = <JwtPayload | null>this.jwtService.decode(token);
      if (t === null) {
        throw new UnprocessableEntityException(
          this.i18n.t('app.alert.token_invalid', {
            lang: I18nContext.current().lang,
          }),
        );
      }
    }
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.get('JWT_SECRET_ACCESS'),
      });
    } catch (e) {
      throw new UnprocessableEntityException(
        this.i18n.t(`app.alert.${e.message}`, {
          lang: I18nContext.current().lang,
        }),
      );
    }
  }

  public async userFromAuthenticationToken(token: string) {
    const payload = <JwtPayload>this.jwtService.verify(token, {
      secret: this.configService.get('JWT_SECRET_ACCESS'),
    });
    if (payload.sub) {
      const user = await this.userService.getById(payload.sub);
      if (user.hashRt !== payload.session) {
        throw new ForbiddenException(
          this.i18n.t('app.alert.access_denied', {
            lang: 'en'
          }),
        );
      }
      return user;
    }
    throw new NotFoundException(
      this.i18n.t('app.alert.user_not_found', {
        lang: 'en',
      }),
    );
  }
}
