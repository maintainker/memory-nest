import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import Users from 'src/entities/Users';
import { User } from 'src/users/users.decorator';
import { Response } from 'express';
import { CreateAlbumRequestDto } from './dtos/createAlbum.request.dtos';
import { AuthGuard } from 'src/auth/auth.guard';
import { AlbumsService } from './albums.service';

@ApiTags('ALBUMS')
@Controller('albums')
export class AlbumsController {
  constructor(private readonly albumService: AlbumsService) {}
  @ApiOperation({ summary: '유저의 album list 가져오기' })
  @UseGuards(AuthGuard)
  @ApiBearerAuth('authorization')
  @Get()
  async getAlbums(@User() user: Users, @Res() response: Response) {
    return response.status(200).send({ success: true, albums: user.albumUser });
  }

  @ApiOperation({ summary: 'album 생성하기' })
  @Post()
  @ApiBearerAuth('authorization')
  @UseGuards(AuthGuard)
  async createAlbum(
    @User() user: Users,
    @Body() body: CreateAlbumRequestDto,
    @Res() response: Response,
  ) {
    try {
      await this.albumService.createAlbum(body, user);
      return response.status(201).send({ success: true });
    } catch (error) {
      return response.status(200).send({
        success: false,
        message:
          error.message ||
          '비정상적인 에러입니다. 지속되면 개발자에게 문의주세요.',
      });
    }
    return true;
  }
}
