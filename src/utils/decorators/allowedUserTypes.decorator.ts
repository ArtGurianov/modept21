import { SetMetadata } from '@nestjs/common';

export const AllowedUserTypes = (...allowedUserTypes: string[]) => SetMetadata('allowedUserTypes', allowedUserTypes);
