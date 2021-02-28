import { BadRequestException, ValidationPipe } from '@nestjs/common';

export const baseValidationPipe = new ValidationPipe({
  exceptionFactory: errors => new BadRequestException(errors),
});
