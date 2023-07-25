import {
  ForbiddenException,
  Global,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { SignUp } from './dto/sign-up';
import { Auth } from './dto/auth';
import * as argon2 from 'argon2';
import { UserService } from '../user/user.service';
import { Tokens } from './dto/tokens';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { UserFilter } from '../user/user.filter';
import { uid } from 'uid';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { TokenType } from './strategies/token.type';
import { JwtPayload } from './strategies/jwt.payload';
import { UserStatus } from '../user/enums/user.status';
import { Role } from '../user/enums/role';
import { UserI } from '../user/interfaces/user.interface';

@Global()
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly i18n: I18nService,
  ) {}

  hashPassword(password: string) {
    return argon2.hash(password);
  }

  async tokens(user: UserI): Promise<Tokens> {
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
          secret: jwtConstants.secretAccess,
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
          secret: jwtConstants.secretRefresh,
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
    const hash = await this.hashPassword(auth.password);
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
      userId: user.id,
      hashRt: uid(21),
    });
    return this.tokens(user);
  }

  async logout(userId: number) {
    await this.userService.update({
      userId: userId,
      hashRt: uid(21),
    });
  }

  async refresh(userId: number): Promise<Tokens> {
    let user = await this.userService.getById(userId);
    user = await this.userService.update({
      userId: userId,
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
        secret: jwtConstants.secretAccess,
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
        secret: jwtConstants.secretAccess,
      });
    } catch (e) {
      throw new UnprocessableEntityException(
        this.i18n.t(`app.alert.${e.message}`, {
          lang: I18nContext.current().lang,
        }),
      );
    }
  }
}
