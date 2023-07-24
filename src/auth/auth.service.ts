import {
  ForbiddenException,
  Global,
  Injectable,
  NotFoundException,
  UnprocessableEntityException
} from '@nestjs/common';
import { SignUp } from './dto/sign-up';
import { Auth } from './dto/auth';
import * as bcrypt from 'bcrypt';
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

@Global()
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly i18n: I18nService,
  ) {}

  hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }

  async tokens(
    userId: number,
    email: string,
    session: string,
  ): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email: email,
          type: TokenType.ACCESS,
          session: session,
        },
        {
          expiresIn: 60 * 30,
          secret: jwtConstants.secretAccess,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email: email,
          type: TokenType.REFRESH,
          session: session,
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
    const userExist = await this.userService.one(
      new UserFilter({ email: auth.email }),
    );
    if (userExist) {
      throw new UnprocessableEntityException(
        this.i18n.t('app.user_email_exists',{ args: { email: auth.email }, lang:   I18nContext.current().lang })
      );
    }
    const hash = await this.hashPassword(auth.password);
    return this.userService.create({
      name: auth.name,
      email: auth.email,
      status: UserStatus.PENDING,
      hash: hash,
      hashRt: uid(21),
    });
  }

  async login(auth: Auth): Promise<Tokens> {
    const user = await this.userService.one(
      new UserFilter({ email: auth.email }),
    );
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const compare: boolean = await bcrypt.compare(auth.password, user.hash);
    if (!compare) {
      throw new ForbiddenException('User password mismatch');
    }
    const session = uid(21);
    const tokens = await this.tokens(user.id, user.email, session);
    await this.userService.update({
      userId: user.id,
      hashRt: session,
    });

    return tokens;
  }

  async logout(userId: number) {
    await this.userService.update({
      userId: userId,
      hashRt: uid(21),
    });
  }

  async refresh(userId: number): Promise<Tokens> {
    const user = await this.userService.getById(userId);
    const session = uid(21);
    const tokens = await this.tokens(user.id, user.email, session);
    await this.userService.update({
      userId: userId,
      hashRt: session,
    });
    return tokens;
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
      const base64Payload = token.split('.')[1];
      const payloadBuffer = Buffer.from(base64Payload, 'base64');
      return JSON.parse(payloadBuffer.toString()) as JwtPayload;
    }
    return <JwtPayload>this.jwtService.decode(token);
  }
}
