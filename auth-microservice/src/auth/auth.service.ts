import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginAuthDto } from './dto/login-auth.dto';
import { User } from 'src/users/entities/user.entity';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email, password): Promise<User> {
    try {
      const user = await this.usersService.findOneByEmail(email);
      if (user && user.password === password) {
        return user;
      }
      return null;
    } catch (error) {
      return error;
    }
  }

  createToken(user: User) {
    const payload = { sub: user._id, email: user.email };

    const access_token = this.jwtService.sign(payload);

    console.log(access_token);
    return {
      access_token,
    };
  }
  async login(loginAuthDto: LoginAuthDto): Promise<any> {
    try {
      const { email, password } = loginAuthDto;
      const user = await this.validateUser(email, password);

      if (user === null || (user && user.password !== password))
        throw new RpcException('email or password not correct.');

      return this.createToken(user);
    } catch (error) {
      return error;
    }
  }

  async createUser(createUserDto: CreateUserDto) {
    try {
      const { email } = createUserDto;

      const userExists = await this.usersService.findOneByEmail(email);

      if (userExists != null) {
        return new RpcException('user with this email already exists');
      }

      const user = await this.usersService.createUser(createUserDto);

      return this.createToken(user);
    } catch (error) {
      return error;
    }
  }
}
