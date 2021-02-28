import {
  Body,
  Controller,
  Headers,
  Get,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { UserTypes } from '../types/userTypes.enum';
import { baseValidationPipe } from '../utils/baseValidationPipe';
import { Public } from '../utils/decorators/public.decorator';
import { AllowedUserTypes } from '../utils/decorators/allowedUserTypes.decorator';
import { LoginInputDto } from './dto/loginInput.dto';
import { User } from './user.entity';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';
import { UserResultType } from '../types/resultTypes';

const cookieOptions = {
  httpOnly: true,
  maxAge: 365 * 24 * 60 * 60 * 1000,
  path: '/user/refresh',
};

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService
    ) {}

  @AllowedUserTypes(UserTypes.ADMIN)
  @Get('/users')
  async getAllUsers(): Promise<User[]> {
    return await this.userService.getAllUsers();
  }

  @Public()
  @Post('/sendOtp')
  async sendOtp(
    @Body('email')
    email: string,
  ): Promise<boolean> {
    return await this.authService.sendOtp(email);
  }

  @Public()
  @Post('/loginWithPassword')
  async loginWithPassword(
    @Body('loginInputDto', baseValidationPipe)
    loginInputDto: LoginInputDto,
    @Res() res: Response,
  ): Promise<void> {
    const {accessToken, refreshToken} = await this.authService.loginWithPassword(loginInputDto);
    res.cookie('jid', refreshToken, cookieOptions).status(200).send({accessToken});
    return;
  }

  @Public()
  @Post('/loginWithOtp')
  async loginWithOtp(
    @Body('email')
    email: string,
    @Body('otp')
    otp: string,
    @Res() res: Response,
  ): Promise<void> {
    const {accessToken, refreshToken} = await this.authService.loginWithOtp(email, otp);
    res.cookie('jid', refreshToken, cookieOptions).status(200).send({accessToken});
    return;
  }

  @Post('/logout')
  async logout(@Res() res: Response): Promise<void> {
    res.cookie('jid', '', {
      httpOnly: true,
      maxAge: 1,
      path: '/user/refresh',
    }).status(200).send({ok: true})
    return;
  }

  @Get('/me')
  async me(@Req() { jwtPayload }: Request): Promise<UserResultType> {
    return await this.userService.me(jwtPayload!.userId, jwtPayload!.userType);
  }

  @Get('/revokeRefreshToken')
  async revokeRefreshToken(@Req() { jwtPayload }: Request): Promise<boolean> {
    return await this.authService.revokeRefreshToken(jwtPayload!.userId);
  }

  @Post('/useRefreshToken')
  async useRefreshToken(
    @Headers('cookie') cookies: string,
    @Res() res: Response,
  ): Promise<void> {
    const {accessToken, refreshToken} = await this.authService.useRefreshToken(cookies);
    res.cookie('jid', refreshToken, cookieOptions).status(200).send({accessToken});
    return;
  }
}
