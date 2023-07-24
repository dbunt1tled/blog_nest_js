import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from '../constants';
import { JwtPayload } from './jwt.payload';
import { UserService } from '../../user/user.service';
import { ForbiddenException, Injectable } from '@nestjs/common';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secretAccess,
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.userService.getById(payload.sub);
    if (user.status === 2) {
      throw new ForbiddenException('Access denied. Please confirm your email');
    }
    if (user.hashRt !== payload.session) {
      throw new ForbiddenException('Access denied.');
    }
    return payload;
  }
}