import { SetMetadata } from '@nestjs/common';

export const AllowedAdminRoles = (...allowedAdminRoles: string[]) => SetMetadata('allowedAdminRoles', allowedAdminRoles);
