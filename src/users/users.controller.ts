import {
  Body,
  Controller,
  Post,
  NotFoundException,
  ForbiddenException,
  Res,
  HttpException,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { JoinRequestDto } from './dtos/join.request.dto';
import { LoginRequestDto } from './dtos/login.request.dto';
import { UsersService } from './users.service';

@ApiTags('USERS')
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService, // private authService: AuthService,
  ) {}

  @ApiOperation({ summary: '로그인' })
  // @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Res() response: Response, @Body() data: LoginRequestDto) {
    const login = (await this.usersService.login(data)) as {
      body: LoginResponse;
      refresh: string;
    };
    if (login.refresh === undefined) {
      return response.status(202).send(login);
    }
    response.cookie('Memory-refresh', login.refresh, {
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60 * 2, // 2시간
    });
    return response.status(200).send(login.body);
  }

  @ApiOperation({ summary: '회원가입' })
  // @UseGuards(NotLoggedInGuard)// 추후 인증 추가
  @Post('sign-up')
  async join(@Res() response: Response, @Body() data: JoinRequestDto) {
    const result = await this.usersService.join(
      data.userId,
      data.name,
      data.password,
    );
    if (result) {
      return response.status(201).send({
        seccess: true,
      });
    } else {
      throw new HttpException(
        '비정상적인 오류입니다. 지속되면 개발자에게 문의주세요.',
        400,
      );
    }
  }
}
