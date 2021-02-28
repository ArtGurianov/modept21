import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { sign, verify } from 'jsonwebtoken';
import { JwtPayload } from '../types/jwtPayload';
import { defaultInsecureKey } from '../utils/constants';
import { CreateAccessTokenDto } from './dto/createAccessToken.dto';
import { CreateRefreshTokenDto } from './dto/createRefreshToken.dto';
 
@Injectable()
export class JwtService {
  public constructor(private readonly configService: ConfigService) {}

  createAccessToken(createAccessTokenDto: CreateAccessTokenDto): string {
    return sign(
      createAccessTokenDto,
      this.configService.get<string>('jwtAccessSecret', defaultInsecureKey),
      { expiresIn: '15m' },
    );
  }

  createRefreshToken(createRefreshTokenDto: CreateRefreshTokenDto): string {
    return sign(
      createRefreshTokenDto,
      this.configService.get<string>('jwtRefreshSecret', defaultInsecureKey),
      { expiresIn: '7d' },
    );
  }

  issueTokens(createRefreshTokenDto: CreateRefreshTokenDto): {accessToken: string, refreshToken: string} {
    const accessToken = this.createAccessToken(createRefreshTokenDto);
    const refreshToken = this.createRefreshToken(createRefreshTokenDto);
    return {accessToken, refreshToken};
  }

  verifyAccessToken(jid: string): JwtPayload | null {
    let payload: any;
    try {
      payload = verify(
        jid,
        this.configService.get<string>('jwtAccessSecret', defaultInsecureKey),
      );
    } catch (e) {
      console.log(e);
      return null;
    }

    return payload ? payload : null;
  }

  verifyRefreshToken(jid: string): JwtPayload | null {
    let payload: any;
    try {
      payload = verify(
        jid,
        this.configService.get<string>('jwtRefreshSecret', defaultInsecureKey),
      );
    } catch (e) {
      console.log(e);
      return null;
    }

    return payload ? payload : null;
  }
  
}
