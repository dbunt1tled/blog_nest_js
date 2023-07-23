import { Global, Module } from '@nestjs/common';
import { ORMService } from './o-r-m.service';

@Global()
@Module({
  providers: [ORMService],
  exports: [ORMService],
})
export class ORMModule {}
