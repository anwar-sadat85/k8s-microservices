// src/users/internal-users.controller.ts
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { InternalGuard } from '../auth/internal.guard';
import type { CreateUserDto } from './dto/create-user.dto';

@Controller('internal/users')
export class InternalUsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(InternalGuard)
  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.createUser(dto);
  }
}
