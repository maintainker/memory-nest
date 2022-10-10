import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Events from 'src/entities/Events';
import Spots from 'src/entities/Spots';
import Photos from 'src/entities/Photo';

@Module({
  imports: [
    TypeOrmModule.forFeature([Events, Spots, Photos], process.env.DB_NAME),
  ],
  providers: [EventsService],
  controllers: [EventsController],
})
export class EventsModule {}
