import {
  Body,
  Controller,
  Post,
  UseGuards,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JoinRequestDto } from './dtos/join.request.dto';
import { UsersService } from './users.service';

@ApiTags('USERS')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: '로그인' })
  // @UseGuards(LocalAuthGuard)
  // @Post('login')
  // async login(@Users() user: Users) {
  //   return user;
  // }
  @ApiOperation({ summary: '회원가입' })
  // @UseGuards(NotLoggedInGuard)// 추후 인증 추가
  @Post()
  async join(@Body() data: JoinRequestDto) {
    const user = this.usersService.findByUserId(data.userId);
    if (!user) {
      throw new NotFoundException();
    }
    const result = await this.usersService.join(
      data.userId,
      data.name,
      data.password,
    );
    console.log('users: ', result);
    if (result) {
      return 'ok';
    } else {
      throw new ForbiddenException();
    }
  }
}
