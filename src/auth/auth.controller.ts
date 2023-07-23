import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Auth } from './dto/auth';
import { SignUp } from './dto/sign-up';
import { Request, Response } from 'express';
import { Tokens } from './dto/tokens';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() auth: SignUp, @Res() res: Response) {
    await this.authService.signup(auth);
    res.status(HttpStatus.OK).json({}).send();
  }

  @Post('login')
  async login(@Body() auth: Auth, @Res() res: Response) {
    const tokens: Tokens = await this.authService.login(auth);
    res.status(HttpStatus.OK).json(tokens).send();
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  async logout(@Req() req: Request, @Res() res: Response) {
    const user = req.user;
    console.log(user);
    await this.authService.logout(user['sub']);
    res.status(HttpStatus.OK).json({}).send();
  }

  @Post('refresh')
  @UseGuards(AuthGuard('jwt-refresh'))
  async refresh(@Req() req: Request, @Res() res: Response) {
    const user = req.user;
    console.log(user);
    const tokens: Tokens = await this.authService.refresh(user['sub']);
    res.status(HttpStatus.OK).json(tokens).send();
  }
}
