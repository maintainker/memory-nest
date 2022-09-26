import {
  Controller,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ImageService } from './image.service';

import 'dotenv/config';
import {
  ApiBearerAuth,
  // ApiCreatedResponse,
  ApiOperation,
} from '@nestjs/swagger';
import 'multer';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @ApiOperation({ summary: '업로드 기본 입니다.' })
  @ApiBearerAuth('authorization')
  // @ApiCreatedResponse
  // @Apibody
  @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(FilesInterceptor('files', 10))
  async uploadImage(@UploadedFiles() files: Express.Multer.File) {
    return this.imageService.uploadImage(files);
  }
}
