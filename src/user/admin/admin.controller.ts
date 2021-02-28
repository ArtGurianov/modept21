import {
  Controller,
  Get,
  Logger,
  OnApplicationBootstrap,
  Param,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from '../../auth/auth.service';
import { UserTypes } from '../../types/userTypes.enum';
import { AllowedUserTypes } from '../../utils/decorators/allowedUserTypes.decorator';

import { AdminService } from './admin.service';

@ApiTags('admin')
@Controller('admin')
export class AdminController implements OnApplicationBootstrap {
  private readonly logger = new Logger(AdminController.name);
  constructor(
    private readonly adminService: AdminService,
    private readonly authService: AuthService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    const id = await this.adminService.injectSuperAdmin();
    if (id) {
      this.logger.log(`Super admin id: ${id}`);
    }
  }

  @AllowedUserTypes(UserTypes.ADMIN)
  @Get('/revokeRefreshToken/:userId')
  async revokeRefreshToken(@Param('userId') userId: string): Promise<boolean> {
    return this.authService.revokeRefreshToken(userId);
  }
}
