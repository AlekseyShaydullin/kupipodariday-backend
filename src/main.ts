import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const corsOptions: CorsOptions = {
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  };
  app.enableCors(corsOptions);

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT || 3000, () => {
    console.log(`App listening on port 3000`);
  });
}
bootstrap();
