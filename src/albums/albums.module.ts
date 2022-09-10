import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Albums from 'src/entities/Album';
import { AlbumsService } from './albums.service';
import { AlbumsController } from './albums.controller';
import AlbumUser from 'src/entities/AlbumUser';
import Users from 'src/entities/Users';

@Module({
  imports: [
    TypeOrmModule.forFeature([Albums, AlbumUser, Users], process.env.DB_NAME),
  ],
  providers: [AlbumsService],
  controllers: [AlbumsController],
  exports: [AlbumsService],
})
export class AlbumsModule {}
