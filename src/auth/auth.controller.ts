import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Auth } from './dto/auth';
import { SignUp } from './dto/sign-up';
import { Tokens } from './dto/tokens';

@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) {
  }

  @Post('signup')
  signup(@Body() auth: SignUp){
    this.authService.signup(auth);
  }

  @Post('login')
  login(@Body() auth: Auth) {
    return this.authService.login(auth);
  }

  @Post('logout')
  logout(){
    this.authService.logout();
  }

  @Post('refresh')
  refresh(){
    this.authService.refresh();
  }
}
