import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private usersRepo: Repository<User>) {}

  findBySub(sub: string) {
    return this.usersRepo.findOneBy({ sub });
  }

  createUser(dto: CreateUserDto) {
    // save() upserts on the primary key (sub), so a retried
    // Post-Login Action call is harmless rather than a duplicate-key error.
    return this.usersRepo.save(dto);
  }

  async updateUser(sub: string, dto: UpdateUserDto): Promise<User | null> {
    // Explicit find-then-save rather than save({ sub, ...dto }) — the latter
    // would upsert on the primary key and silently create a row for a user
    // with no profile yet. Only POST /internal/users is allowed to create.
    const existing = await this.usersRepo.findOneBy({ sub });
    if (!existing) return null;
    Object.assign(existing, dto);
    return this.usersRepo.save(existing);
  }
}