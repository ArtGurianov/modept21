import { IsNumber } from "class-validator";
import { CreateAccessTokenDto } from "./createAccessToken.dto";

export class CreateRefreshTokenDto extends CreateAccessTokenDto {
  @IsNumber()
  tokenVersion: number;
}