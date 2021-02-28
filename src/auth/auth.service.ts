import { Injectable, ServiceUnavailableException, UnauthorizedException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import cookie from 'cookie';
import { JwtService } from '../jwt/jwt.service';
import { RedisService } from '../redis/redis.service';
import { REDIS_PREFIXES } from '../types/redisPrefixes.enum';
import { LoginInputDto } from '../user/dto/loginInput.dto';
import { UserRepository } from '../user/user.repository';
import otpGen from '../utils/otpGen';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    @InjectRepository(UserRepository)
    private readonly userRepo: UserRepository,
    ) {}

  async sendOtp(email: string): Promise<boolean> {
    const otp = otpGen();
    await this.redisService.set(
      `${REDIS_PREFIXES.OTP}${otp}`,
      email,
      60 * 10,
    );
    //TODO: send by email
    return true;
  }

  async validateOtp(email: string, otp: string): Promise<boolean> {
    const storedEmail = await this.redisService.get(
      `${REDIS_PREFIXES.OTP}${otp}`,
    );
    if (!storedEmail) {
      throw new UnauthorizedException();
    }
    await this.redisService.del(`${REDIS_PREFIXES.OTP}${otp}`);
    if (storedEmail !== email) {
      throw new UnauthorizedException();
    }
    return true;
  }

  async loginWithOtp(email: string, otp: string): Promise<{accessToken: string, refreshToken: string}> {
    const isValid = await this.validateOtp(email, otp);
    if (!isValid) {
      throw new UnauthorizedException();
    }
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException();
    }
    const tokens = this.jwtService.issueTokens({userId: user.id, userType: user.userType, tokenVersion: user.tokenVersion});
    return tokens;
  }

  async loginWithPassword(loginInputDto: LoginInputDto): Promise<{accessToken: string, refreshToken: string}> {
    const user = await this.userRepo.findOne({ where: { email: loginInputDto.email } });
    if (!user) {
      throw new UnauthorizedException();
    }
    const valid = await bcrypt.compare(loginInputDto.password, user.password);
    if (!valid) {
      throw new UnauthorizedException();
    }
    const tokens = this.jwtService.issueTokens({userId: user.id, userType: user.userType, tokenVersion: user.tokenVersion});
    return tokens;
  }

  async revokeRefreshToken(userId: string): Promise<boolean> {
    const result = await this.userRepo.increment(
      { id: userId },
      'tokenVersion',
      1,
    );
    if (!result)
      throw new ServiceUnavailableException(
        'Ohhh.. Could not process operation.',
      );
    return true;
  }

  async useRefreshToken(cookies: string): Promise<{accessToken: string, refreshToken: string}> {
    if (!cookies) {
      throw new UnauthorizedException('Cookie not provided.');
    }

    const parsed = cookie.parse(cookies);

    if (!parsed.jid) {
      throw new UnauthorizedException('Refresh token not provided.');
    }

    const jwtPayload = this.jwtService.verifyRefreshToken(parsed.jid);

    if (!jwtPayload) {
      throw new UnauthorizedException('Broken jwt.');
    }

    const user = await this.userRepo.findOne({ id: jwtPayload.userId });

    if (!user) {
      throw new UnauthorizedException();
    }

    if (user.tokenVersion !== jwtPayload.tokenVersion) {
      throw new UnauthorizedException('Revoked token');
    }

    const tokens = await this.jwtService.issueTokens({userId: user.id, userType: user.userType, tokenVersion: user.tokenVersion, agencyId: jwtPayload.agencyId, userTypeRole: jwtPayload.userTypeRole});
    return tokens;
  }

}