import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Headers,
  UseGuards,
  UnauthorizedException,
  UseFilters,
  BadRequestException,
  Req,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { LoginAuthDto } from './dto/login-auth.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from './guards/auth.guard';
import { catchError, throwError } from 'rxjs';
import { Token } from './interfaces/token.interface';
import { User } from './interfaces/user.interface';

@Controller('auth')
export class AuthController {
  constructor(@Inject('AUTH') private authService: ClientProxy) {}

  @Post('/login')
  async login(@Body() loginAuthDto: LoginAuthDto): Promise<Token> {
    try {
      const token = await this.authService
        .send('login', loginAuthDto)
        .toPromise();
      return token;
    } catch (error) {
      return error;
    }
  }

  @Post('/signup')
  async signup(@Body() createUserDto: CreateUserDto): Promise<Token> {
    try {
      const token = await this.authService
        .send('signup', createUserDto)
        .toPromise();
      return token;
    } catch (error) {
      return error;
    }
  }

  @UseGuards(AuthGuard)
  @Get('/me')
  async profile(@Req() req): Promise<User> {
    try {
      return req.user;
    } catch (error) {
      return error;
    }
  }

  @UseGuards(AuthGuard)
  @Get('/test-auth')
  async test(): Promise<string> {
    try {
      return 'you are Authentication';
    } catch (error) {
      return error;
    }
  }
}
