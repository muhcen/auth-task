import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.userRepo.findOne({ where: { email } });
    return user;
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      const password = await bcrypt.hash(createUserDto.password, 10);

      const user = this.userRepo.create({
        email: createUserDto.email,
        password,
      });
      await this.userRepo.save(user);
      return user;
    } catch (error) {
      return error;
    }
  }
}
