import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Response } from 'express';
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const r = exception.getResponse() as any;
      message = typeof r === 'string' ? r : (Array.isArray(r.message) ? 'Validation failed' : r.message || message);
    } else {
      this.logger.error('Unhandled error', exception);
    }
    response.status(status).json({ statusCode: status, message, timestamp: new Date().toISOString() });
  }
}
