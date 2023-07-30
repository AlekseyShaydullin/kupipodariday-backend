import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.PORT) || 5432,
      username: process.env.DB_USER || 'student',
      password: process.env.DB_PASS || 'student',
      database: process.env.DB_NAME || 'kupipodariday',
      entities: [],
      synchronize: false,
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
