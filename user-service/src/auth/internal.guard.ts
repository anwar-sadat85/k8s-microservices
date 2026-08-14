// src/auth/internal.guard.ts
import { ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class InternalGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);

    const { user } = context.switchToHttp().getRequest();
    const permissions: string[] = user?.permissions ?? [];
    if (!permissions.includes('create:users')) {
      throw new ForbiddenException(
        'Missing required permission: create:users',
      );
    }
    return true;
  }
}
