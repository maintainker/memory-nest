import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Albums from 'src/entities/Album';
import { AlbumsService } from './albums.service';
import { AlbumsController } from './albums.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Albums], process.env.DB_NAME)],
  providers: [AlbumsService],
  controllers: [AlbumsController],
  exports: [AlbumsService],
})
export class AlbumsModule {}
