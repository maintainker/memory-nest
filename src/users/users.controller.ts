import {
  Body,
  Controller,
  Post,
  UseGuards,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { JoinRequestDto } from './dtos/join.request.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: '회원가입' })
  // @UseGuards(NotLoggedInGuard)// 추후 인증 추가
  @Post()
  async join(@Body() data: JoinRequestDto) {
    const user = this.usersService.findByUserId(data.userId);
    if (!user) {
      throw new NotFoundException();
    }
    console.log(data);
    const result = await this.usersService.join(
      data.userId,
      data.name,
      data.password,
    );

    if (result) {
      return 'ok';
    } else {
      throw new ForbiddenException();
    }
  }
}
