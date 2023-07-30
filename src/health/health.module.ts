import { LoggerService, Module } from '@nestjs/common';
import {
  DiskHealthIndicator,
  HealthCheckService,
  MemoryHealthIndicator,
  PrismaHealthIndicator, TerminusModule
} from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { ORMService } from '../connectors/orm/o-r-m.service';
import { HealthCheckExecutor } from '@nestjs/terminus/dist/health-check/health-check-executor.service';
import { ErrorLogger } from '@nestjs/terminus/dist/health-check/error-logger/error-logger.interface';

@Module({
  imports: [TerminusModule],
  controllers: [HealthController],
  providers: [
    ORMService,
  ],
})
export class HealthModule {}
