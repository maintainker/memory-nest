import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthMiddleWare } from './auth/auth.middleware';
// import { AuthModule } from './auth/auth.module';
import { JwtModule } from './auth/jwt.module';
import Entities from './entities';
import { UsersModule } from './users/users.module';
// import { UsersService } from './users/users.service';
import { AlbumsModule } from './albums/albums.module';
import { ImageModule } from './image/image.module';
import { S3 } from 'aws-sdk';
import { EventsModule } from './events/events.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.prod',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'prod').required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        AWS_S3_BUCKET_NAME: Joi.string().required(),
        AWS_ACCESS_KEY_ID: Joi.string().required(),
        AWS_SECRET_ACCESS_KEY: Joi.string().required(),
        AWS_REGION: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: true,
      logging: true,
      entities: Entities,
    }),
    UsersModule,
    // AuthModule,
    JwtModule.forRoot({
      privateAccessKey: process.env.TOKEN_ACCESS_KEY,
      privateRefreshKey: process.env.TOKEN_REFRESH_KEY,
    }),
    AlbumsModule,
    ImageModule,
    EventsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleWare)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
