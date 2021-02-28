import { IsString } from "class-validator";

export class NewModelInvitationDto {
  @IsString()
  email: string;

  @IsString()
  signedPdfLink: string;
}
