import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HeadBookerGuard } from '../../utils/guards/headBooker.guard';
import { BookerService } from './booker.service';
import { Request } from "express";

@ApiTags('booker')
@Controller()
export class BookerController {
  constructor(
    private readonly bookerService: BookerService
  ) {}

  @UseGuards(HeadBookerGuard)
  @Post('/promoteBooker')
  async promoteBooker(
    @Body('bookerId') bookerId: string,
    @Req() { jwtPayload }: Request
  ): Promise<boolean> {
    return await this.bookerService.promoteBooker(jwtPayload!.agencyId, jwtPayload!.userId, bookerId);
  }

  @UseGuards(HeadBookerGuard)
  @Post('/demoteBooker')
  async demoteBooker(
    @Body('bookerId') bookerId: string,
    @Req() { jwtPayload }: Request
  ): Promise<boolean> {
    return await this.bookerService.demoteHeadBooker(jwtPayload!.agencyId, jwtPayload!.userId, bookerId);
  }

  @UseGuards(HeadBookerGuard)
  @Post('/activateBooker')
  async activateBooker(
    @Body('bookerId') bookerId: string,
    @Req() { jwtPayload }: Request
  ): Promise<boolean> {
    return await this.bookerService.activateBooker(jwtPayload!.agencyId, jwtPayload!.userId, bookerId);
  }

  @UseGuards(HeadBookerGuard)
  @Post('/deactivateBooker')
  async deactivateBooker(
    @Body('bookerId') bookerId: string,
    @Req() { jwtPayload }: Request
  ): Promise<boolean> {
    return await this.bookerService.deactivateBooker(jwtPayload!.agencyId, jwtPayload!.userId, bookerId);
  }

}
