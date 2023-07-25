import {
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException, Logger
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()
export class ExceptionHandler extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const logger: Logger = new Logger();
    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let response =
      exception instanceof HttpException
        ? exception.getResponse()
        : exception instanceof Error
        ? { message: exception.message }
        : { message: 'Internal Server Error' };

    if (Object.prototype.toString.call(response) === '[object String]') {
      response = { message: response };
    }
    const debug =
      exception instanceof Error
        ? { file: exception.stack.split('\n')[1].trim() }
        : {};
    const responseBody = {
      ...(response as NonNullable<unknown>),
      ...{
        statusCode: httpStatus,
        timestamp: new Date().toISOString(),
        path: httpAdapter.getRequestUrl(ctx.getRequest()),
      },
      ...debug,
    };
    logger.debug(exception);
    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
    super.catch(exception, host);
  }
}
