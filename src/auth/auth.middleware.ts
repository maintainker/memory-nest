import { NextFunction, Request, Response } from 'express';
import { Inject, NestMiddleware } from '@nestjs/common';
import { JwtService } from 'src/auth/jwt.service';
import { UsersService } from 'src/users/users.service';

export class AuthMiddleWare implements NestMiddleware<Request, Response> {
  @Inject(JwtService) private readonly jwtService: JwtService;
  @Inject(UsersService) private readonly userService: UsersService;

  async use(req: Request, res: Response, next: NextFunction) {
    if ('authorization' in req.headers) {
      const tokenArr = req.headers['authorization'].split(' ');
      const token = tokenArr[1];
      try {
        if (tokenArr[0] !== 'Bearer') {
          throw {
            message: '인가안된 토큰',
          };
        }
        const decoded = this.jwtService.verifyAccess(token.toString());
        if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
          const userInfo = await this.userService.findById(decoded['id']);
          if (userInfo)
            req['user'] = {
              id: userInfo.id,
              name: userInfo.name,
              userId: userInfo.userId,
              albumUser: userInfo.albumUser,
            };
        }
      } catch (error) {
        console.log(error);
      }
    }
    next();
  }
}
