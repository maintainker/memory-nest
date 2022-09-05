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

import { NextFunction, Request, Response } from 'express';
import { Inject, NestMiddleware } from '@nestjs/common';
import { JwtService } from 'src/auth/jwt.service';
import { UsersService } from 'src/users/users.service';

// // import { JwtService } from '@nestjs/jwt';
// import { NextFunction } from 'express';
export class AuthMiddleWare implements NestMiddleware<Request, Response> {
  // constructor(
  @Inject(JwtService) private readonly jwtService: JwtService; // 토큰을 object로 해독하기 위함
  @Inject(UsersService) private readonly userService: UsersService; // 사용자 id로 full정보를 얻기 위함
  // ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    if ('authorization' in req.headers) {
      console.log(req.headers['authorization']);
      // jwt 토큰이 헤더에 있는지 확인
      const token = req.headers['authorization']; // todo barer 제거해야함
      try {
        const decoded = this.jwtService.verifyAccess(token.toString()); // 토큰을 object로 변경한다.
        console.log(decoded);
        if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
          console.log('inthe if');
          const userInfo = await this.userService.findById(decoded['id']);
          if (userInfo)
            req['user'] = {
              id: userInfo.id,
              name: userInfo.name,
              userId: userInfo.userId,
            };
        }
      } catch (error) {
        console.log(error);
      }
    }
    next();
  }
}
// import { CanActivate, ExecutionContext, HttpException } from '@nestjs/common';
// import { JwtService } from 'src/auth/jwt.service';
// // import HttpError from "exception/HttpError";
// export default class AuthGuard implements CanActivate {
//   constructor(private jwtSerice: JwtService) {}
//   public canActivate(context: ExecutionContext): boolean {
//     // CanActivate를 implements 하였으므로, canActivate 함수를 구현해야 합니다.
//     const request = context.switchToHttp().getRequest();
//     // 클라이언트에서 보낸 request 정보를 읽어옵니다.

//     const { access_token } = request.headers;
//     // 사용자가 헤더에 보낸 access_token key값의 토큰값.

//     if (access_token === undefined) {
//       // 토큰이 전송되지 않았다면
//       throw new HttpException('토큰이 전송되지 않았습니다.', 401);
//     }

//     request.user = this.validateToken(access_token);
//     // request.user 객체에 디코딩된 토큰(유저 정보)을 저장합니다.
//     return true;
//   }

//   public validateToken(token: string): string {
//     try {
//       const verify: string = this.jwtSerice.verifyAccess(token) as string;
//       return verify;
//     } catch (error) {
//       switch (error.message) {
//         // 토큰에 대한 오류를 판단합니다.
//         case 'INVALID_TOKEN':
//         case 'TOKEN_IS_ARRAY':
//         case 'NO_USER':
//         case 'EXPIRED_TOKEN':
//           throw new HttpException('유효하지 않은 토큰입니다.', 401);

//         default:
//           throw new HttpException('서버 오류입니다.', 500);
//       }
//     }
//   }
// }

// export const AuthMiddleWare = (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   console.log('test');
//   console.log(req.headers.authorization);
//   next();
// };
