import { ForbiddenException, HttpException, Injectable, NotFoundException, Post } from '@nestjs/common';
import { ORMService } from '../connectors/o-r-m.service';
import { SignUp } from './dto/sign-up';
import { Auth } from './dto/auth';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { Tokens } from './dto/tokens';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { UserFilter } from '../user/user.filter';
import { uid } from 'uid';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
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
    const hash = await this.hashPassword(auth.password);
    const user = await this.userService.create({
      name: auth.name,
      email: auth.email,
      hash: hash,
    });
    return user;
  }

  async login(auth: Auth): Promise<Tokens> {
    const user = await this.userService.one(
      Object.assign(new UserFilter(), { email: auth.email }),
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
}
