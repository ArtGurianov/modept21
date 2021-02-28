import { ArgumentsHost, Catch, ExceptionFilter, ForbiddenException } from '@nestjs/common';

@Catch(ForbiddenException)
export class ForbiddenExceptionFilter implements ExceptionFilter {
  catch(_: ForbiddenException, host: ArgumentsHost): void {
    host.switchToHttp().getResponse().redirect('/auth/login');
  }
}