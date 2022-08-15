// import { Injectable, NestMiddleware } from '@nestjs/common';
// import { NextFunction, Request, Response } from 'express';
// import { JwtService } from './jwt.service';
// import { UsersService } from '../users/users.service';
// @Injectable()
// export class JwtMiddleware implements NestMiddleware {
//   constructor(
//     private readonly jwtService: JwtService,
//     private readonly usersService: UsersService,
//   ) {}
//   async use(req: Request, res: Response, next: NextFunction) {
//     if ('x-jwt' in req.headers) {
//       const token = req.headers['x-jwt'];
//       try {
//         const decoded = this.jwtService.verify(token.toString());
//         if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
//           const user = await this.usersService.findById(decoded['id']);
//           req['user'] = user;
//         }
//       } catch (error) {}
//     }
//     next();
//   }
// }

import { NestMiddleware } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
import { NextFunction } from 'express';
import { JwtService } from 'src/auth/jwt.service';
import { UsersService } from 'src/users/users.service';
export class JwtMiddleWare implements NestMiddleware<Request, Response> {
  constructor(
    private readonly jwtService: JwtService, // 토큰을 object로 해독하기 위함
    private readonly userService: UsersService, // 사용자 id로 full정보를 얻기 위함
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    if ('Authentication' in req.headers) {
      // jwt 토큰이 헤더에 있는지 확인
      const token = req.headers['Authentication']; // todo barer 제거해야함
      try {
        const decoded = this.jwtService.verifyAccess(token.toString()); // 토큰을 object로 변경한다.
        if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
          const userInfo = await this.userService.findById(decoded['id']);
          if (userInfo) req['user'] = userInfo;
        }
      } catch (error) {
        console.log(error);
      }
    }
    next();
  }
}
