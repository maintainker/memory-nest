import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Users from 'src/entities/Users';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([Users], process.env.DB_NAME)],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
