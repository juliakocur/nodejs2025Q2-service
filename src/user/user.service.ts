import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { plainToInstance } from 'class-transformer';
import { InMemoryData } from '../data/in-memory.data';
import { User, UserResponse } from '../interfaces';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { validate as isUUID } from 'uuid';
import { Expose, Exclude } from 'class-transformer';

class UserEntity implements User {
  @Expose()
  id: string;
  @Expose()
  login: string;
  @Exclude()
  password: string;
  @Expose()
  version: number;
  @Expose()
  createdAt: number;
  @Expose()
  updatedAt: number;

  constructor(user: User) {
    Object.assign(this, user);
  }
}

@Injectable()
export class UserService {
  findAll(): UserResponse[] {
    return plainToInstance(UserEntity, InMemoryData.users);
  }

  findOne(id: string): UserResponse {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }
    const user = InMemoryData.users.find((u) => u.id === id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return plainToInstance(UserEntity, user);
  }

  create(dto: CreateUserDto): UserResponse {
    const user: User = {
      id: uuid(),
      login: dto.login,
      password: dto.password,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    InMemoryData.users.push(user);
    return plainToInstance(UserEntity, user);
  }

  update(id: string, dto: UpdatePasswordDto): UserResponse {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }
    const user = InMemoryData.users.find((u) => u.id === id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.password !== dto.oldPassword) {
      throw new ForbiddenException('Old password is incorrect');
    }
    user.password = dto.newPassword;
    user.version += 1;
    user.updatedAt = Date.now();
    return plainToInstance(UserEntity, user);
  }

  delete(id: string): void {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }
    const index = InMemoryData.users.findIndex((u) => u.id === id);
    if (index === -1) {
      throw new NotFoundException('User not found');
    }
    InMemoryData.users.splice(index, 1);
  }
}
