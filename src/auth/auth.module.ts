import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
// import { LocalStrategy } from './local.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: 'jwt secret key',
      signOptions: { expiresIn: 1800 },
    }),
  ],
  providers: [AuthService],
  exports: [JwtModule, AuthService],
})
export class AuthModule {}
