import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@prisma/client';

export const WsCurrentUser = createParamDecorator(
  (data: keyof User, ctx: ExecutionContext) => {
    const client = ctx.switchToWs().getClient();
    return data ? client.data.user[data] : client.data.user;
  },
);
