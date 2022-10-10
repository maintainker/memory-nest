import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import Users from 'src/entities/Users';
import { User } from 'src/users/users.decorator';
import { response, Response } from 'express';
import { CreateAlbumRequestDto } from './dtos/createAlbum.request.dtos';
import { AuthGuard } from 'src/auth/auth.guard';
import { AlbumsService } from './albums.service';
import { userInfo } from 'os';

@ApiTags('ALBUMS')
@Controller('albums')
export class AlbumsController {
  constructor(private readonly albumService: AlbumsService) {}

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
      await this.albumService.createAlbum(body, user); // TODO : 앨범 리턴해서 생성 유무 알려주기
      return response.status(201).send({ success: true });
    } catch (error) {
      return response.status(200).send({
        success: false,
        message:
          error.message ||
          '비정상적인 에러입니다. 지속되면 개발자에게 문의주세요.',
      });
    }
  }

  @ApiOperation({ summary: 'albumList 가져오기' })
  @Get()
  @ApiBearerAuth('authorization')
  @UseGuards(AuthGuard)
  async getAlbumList(@User() user: Users, @Res() response: Response) {
    try {
      const values = await this.albumService.getAlbums(user.id);
      return response.status(200).send({ list: values });
    } catch (error) {
      return response.status(200).send({
        success: false,
        message:
          error.message ||
          '비정상적인 에러입니다. 지속되면 개발자에게 문의주세요.',
      });
    }
  }

  @ApiOperation({ summary: 'album Detail 가져오기' })
  @Get('/detail')
  @ApiBearerAuth('authorization')
  @UseGuards(AuthGuard)
  async getAlbumDetail(
    @User() user: Users,
    @Res() response: Response,
    @Query() query: { albumId: string },
  ) {
    const res = await this.albumService.getAlbumDetail(
      Number(query.albumId),
      user.id,
    );
    return response.send(res);
  }
}
