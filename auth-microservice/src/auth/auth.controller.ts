import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  UseFilters,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('login')
  async login(@Payload() loginAuthDto: LoginAuthDto) {
    try {
      return await this.authService.login(loginAuthDto);
    } catch (error) {
      return error;
    }
  }

  @MessagePattern('signup')
  async signup(@Payload() createUserDto: CreateUserDto) {
    try {
      return await this.authService.createUser(createUserDto);
    } catch (error) {
      return error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @MessagePattern('me')
  getProfile(@Payload() Payload) {
    return Payload.user;
  }
}
