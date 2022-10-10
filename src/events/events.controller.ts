import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import Users from 'src/entities/Users';
import { User } from 'src/users/users.decorator';
import { EventsService } from './events.service';

@ApiTags('추억 그룹')
@Controller('events')
export class EventsController {
  constructor(private readonly eventService: EventsService) {}

  @Get()
  getHello(): string {
    return this.eventService.getEvent();
  }

  @ApiOperation({ summary: '추억 그룹 생성하기' })
  @Post()
  @ApiBearerAuth('authorization')
  @UseGuards(AuthGuard)
  createEvent(
    @User() user: Users,
    @Res() response: Response,
    @Body()
    body: {
      name: string;
      description?: string;
      albumId: number;
    },
  ): unknown {
    return this.eventService.createEvent();
  }
}
