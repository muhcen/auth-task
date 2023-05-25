import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginAuthDto } from './dto/login-auth.dto';
import { User } from 'src/users/entities/user.entity';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { RpcException } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';
import { Token } from './interfaces/token.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  createToken(user: User): Token {
    const payload = { sub: user._id, email: user.email };

    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
    };
  }
  async login(loginAuthDto: LoginAuthDto): Promise<Token> {
    try {
      const { email, password } = loginAuthDto;

      const user = await this.usersService.findOneByEmail(email);

      if (!user) throw new RpcException('email or password not correct.');

      const passwordIsMach = await bcrypt.compare(password, user.password);
      if (!passwordIsMach)
        throw new RpcException('email or password not correct.');

      return this.createToken(user);
    } catch (error) {
      return error;
    }
  }

  async createUser(createUserDto: CreateUserDto): Promise<Token> {
    try {
      const { email } = createUserDto;

      const userExists = await this.usersService.findOneByEmail(email);

      if (userExists != null) {
        throw new RpcException('user with this email already exists');
      }

      const user = await this.usersService.createUser(createUserDto);

      return this.createToken(user);
    } catch (error) {
      return error;
    }
  }
}
