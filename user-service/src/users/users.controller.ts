import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  Req,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { UpdateUserDto } from './dto/update-user.dto';

interface AuthenticatedRequest extends Request {
  user: { sub: string };
}

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Req() req: AuthenticatedRequest) {
    const user = await this.usersService.findBySub(req.user.sub);
    if (!user) {
      throw new NotFoundException('User profile not found');
    }
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async updateMe(@Req() req: AuthenticatedRequest, @Body() dto: UpdateUserDto) {
    const updated = await this.usersService.updateUser(req.user.sub, dto);
    if (!updated) {
      throw new NotFoundException('User profile not found');
    }
    return updated;
  }
}
