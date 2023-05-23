import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UseFilters, ValidationError, ValidationPipe } from '@nestjs/common';
import {
  MicroserviceOptions,
  RpcException,
  Transport,
} from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://host.docker.internal:5672'],
        queue: 'AUTH_SERVICE',
        queueOptions: {
          durable: false,
        },
      },
    },
  );

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        return new RpcException(validationErrors);
      },
    }),
  );
  await app.listen();
}
bootstrap();
