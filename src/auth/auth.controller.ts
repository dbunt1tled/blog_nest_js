import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Auth } from './dto/auth';
import { SignUp } from './dto/sign-up';
import { Response } from 'express';
import { Tokens } from './dto/tokens';
import { AccessGuard, CurrentUserId, Public, RefreshGuard } from './decorators';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @Public()
  async signup(@Body() auth: SignUp, @Res() res: Response) {
    await this.authService.signup(auth);
    res.status(HttpStatus.OK).json({}).send();
  }
  @Post('login')
  @Public()
  async login(@Body() auth: Auth, @Res() res: Response) {
    const tokens: Tokens = await this.authService.login(auth);
    res.status(HttpStatus.OK).json(tokens).send();
  }

  @Post('logout')
  @UseGuards(AccessGuard)
  async logout(@CurrentUserId() userId: number, @Res() res: Response) {
    await this.authService.logout(userId);
    res.status(HttpStatus.OK).json({}).send();
  }

  @Post('refresh')
  @Public()
  @UseGuards(RefreshGuard)
  async refresh(@CurrentUserId() userId: number, @Res() res: Response) {
    console.log(userId);
    const tokens: Tokens = await this.authService.refresh(userId);
    res.status(HttpStatus.OK).json(tokens).send();
  }
}
