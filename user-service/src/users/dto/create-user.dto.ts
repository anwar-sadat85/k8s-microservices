// src/users/dto/create-user.dto.ts
export interface CreateUserDto {
  sub: string;
  email: string;
  firstName?: string;
  lastName?: string;
}
