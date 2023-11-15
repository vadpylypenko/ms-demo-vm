import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {}

  async create(userData: UserEntity): Promise<UserEntity> {
    return this.repository.save(userData);
  }

  // https://github.com/typeorm/typeorm/issues/3608

  // async update(id: string, userData: D): Promise<E> {
  //   return result;
  // }

  // async delete(id: string): Promise<void> {
  //   this.repository.find();
  // }

  // getMany(): Promise<User[]> {
  //   return this.repository.find();
  // }
}
