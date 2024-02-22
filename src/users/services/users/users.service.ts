import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserParams, UpdateUserParams } from 'src/utils/types';
import { Repository } from 'typeorm';
import { User } from 'typeorm/entities/User';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private UserRepository: Repository<User>,
  ) {}
  findUser() {
    return this.UserRepository.find();
  }
  createUser(userDetails: CreateUserParams) {
    const newUser = this.UserRepository.create({
      ...userDetails,
      createdAt: new Date(),
    });
    return this.UserRepository.save(newUser);
  }
  updateUser(id: number, updateUseretails: UpdateUserParams) {
    return this.UserRepository.update({ id }, { ...updateUseretails });
  }
  deleteUser(id: number) {
    return this.UserRepository.delete({ id });
  }
}
