import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateUserParams,
  CreateUserPostParams,
  CreateUserProfileParams,
  UpdateUserParams,
} from 'src/utils/types';
import { Repository } from 'typeorm';
import { Post } from 'typeorm/entities/Post';
import { Profile } from 'typeorm/entities/Profile';
import { User } from 'typeorm/entities/User';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private UserRepository: Repository<User>,
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
    @InjectRepository(Post) private postRepository: Repository<Post>,
  ) {}
  findUser() {
    return this.UserRepository.find({ relations: ['profile', 'posts'] });
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

  async createUserProfile(
    id: number,
    createUserProfileDetails: CreateUserProfileParams,
  ) {
    const user = await this.UserRepository.findOneBy({ id });
    if (!user)
      throw new HttpException(
        'User not found. Cannot create Profile',
        HttpStatus.BAD_REQUEST,
      );
    const newProfile = this.profileRepository.create(createUserProfileDetails);
    const savedProfile = await this.profileRepository.save(newProfile);
    user.profile = savedProfile;
    return this.UserRepository.save(user);
  }
  async createUserPost(
    id: number,
    createUserPostDetails: CreateUserPostParams,
  ) {
    const user = await this.UserRepository.findOneBy({ id });
    if (!user)
      throw new HttpException(
        'User not found. Cannot create Profile',
        HttpStatus.BAD_REQUEST,
      );
    const newPost = this.postRepository.create({
      ...createUserPostDetails,
      user,
    });
    return this.postRepository.save(newPost);
  }
}
