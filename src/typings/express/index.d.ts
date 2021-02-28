import { JwtPayload } from '../../types/jwtPayload';
import { User } from '../../user/user.entity';

declare module 'express' {
  /**
   * Used to inflate a new property on a Request object. The type merging is
   * performed automatically.
   * Usage:
   *
   * ```js
   * import { Req } from '@nestjs/common';
   * import { Request } from 'express';
   *
   * // ...
   * @Get()
   * async someEndpoint(@Req() req: Request) {
   *   console.log(req.jwtPayload); // is accessible now
   * }
   * // ...
   * ```
   */
  interface Request {
    jwtPayload?: JwtPayload;
  }
}
