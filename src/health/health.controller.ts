import { Controller, Get } from '@nestjs/common';
import {
  DiskHealthIndicator,
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
  MicroserviceHealthIndicator,
  PrismaHealthIndicator,
} from '@nestjs/terminus';
import { ORMService } from '../connectors/orm/o-r-m.service';
import { Public } from '../auth/decorators';

@Controller('health')
export class HealthController {
  constructor(
    private ormService: ORMService,
    private healthCheckService: HealthCheckService,
    private prismaHealthIndicator: PrismaHealthIndicator,
    private memoryHealthIndicator: MemoryHealthIndicator,
    private diskHealthIndicator: DiskHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  @Public()
  check() {
    return this.healthCheckService.check([
      () => this.prismaHealthIndicator.pingCheck('nest', this.ormService),
      () =>
        this.memoryHealthIndicator.checkHeap('memory heap', 300 * 1024 * 1024),
      () =>
        this.memoryHealthIndicator.checkRSS('memory RSS', 300 * 1024 * 1024),
      () =>
        this.diskHealthIndicator.checkStorage('disk health', {
          thresholdPercent: 0.5,
          path: '/',
        }),
    ]);
  }
}
