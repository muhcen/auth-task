import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Post,
  Headers,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, throwError } from 'rxjs';

@Controller()
export class AppController {
  constructor(@Inject('AUTH') private authService: ClientProxy) {}

  @Post('auth/login')
  async login(@Body() body) {
    try {
      const token = await this.authService.send('login', body).toPromise();
      return token;
    } catch (error) {
      return error;
    }
  }

  @Post('auth/signup')
  async signup(@Body() body) {
    try {
      const token = await this.authService.send('signup', body).toPromise();
      return token;
    } catch (error) {
      return error;
    }
  }

  @Get('auth/me')
  async profile(@Headers('Authorization') authorizationToken: string) {
    try {
      const token = authorizationToken.split(' ')[1];
      const user = await this.authService
        .send('me', { body: { token } })
        .toPromise();
      return user;
    } catch (error) {
      return error;
    }
  }
}
