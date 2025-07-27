import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';

import { AuthModule } from './modules/auth.module';
import { UsersModule } from './modules/user.module';

import { AuthMiddleware } from './middlewares/auth/auth.middleware'; 
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // makes config available app-wide
    }),
     JwtModule.register({
      global: true,
      secret: 'your_jwt_secret_key', // use env variables for prod
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME,      // your DB user
      password: process.env.DB_PASSWORD,      // your DB password
      database: process.env.DB_NAME, // your DB name
      autoLoadEntities: true,
      synchronize: true,         // auto-create tables in dev
    }),
    TypeOrmModule.forFeature([User, Role]),
    AuthModule,
    UsersModule
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes('user'); // ✅ apply auth middleware for all /user/* routes
  }
}