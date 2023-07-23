import { AuthGuard } from '@nestjs/passport';

export class RefreshGuard extends AuthGuard('jwt-refresh') {
  constructor() {
    super();
  }
}
