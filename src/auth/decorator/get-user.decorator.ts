// src/auth/decorator/get-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
// this decorator is used to extract the user from the request object
// and make it available in the route handler   
export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest(); // get the request object
    // the request object contains the user property which is set by the JwtGuard
    const user = request.user;// get the user object from the request
    // if data is provided, return the specific property of the user object
    return data ? user?.[data] : user;// if data is not provided, return the entire user object
  },
);