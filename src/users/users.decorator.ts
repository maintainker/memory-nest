import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const user = request['user'];
    return user;
  },
);
