import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(userId: string, password: string) {
    const [hashedPassword, user] = await Promise.all([
      bcrypt.hash(password, 12),
      this.usersService.findByUserId(userId),
    ]);
    if (!user) return null;
    const { password: userPassword, ...result } = user;
    if (userPassword === hashedPassword) {
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return { access_token: this.jwtService.sign(payload) };
  }
}
