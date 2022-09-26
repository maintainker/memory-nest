import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const user = request['user'];
    // console.log(user);
    if (!user) {
      return false;
    }
    return true;
  }
}
