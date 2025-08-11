import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';

import {LeaveTypeService} from './services/leave-type.service';
import { LeaveType } from './entities/leave-type.entity';
import { LeaveTypeController } from './controllers/leave-type.controller';

import {ShiftTimingService} from './services/shift-timing.service';
import { ShiftTiming } from './entities/shift-timing.entity';
import { ShiftTimingController } from './controllers/shift-timing.controller';

import { AuthMiddleware } from './middlewares/auth/auth.middleware';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret: configService.get('JWT_SECRET_KEY'),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        console.log('DB_HOST:', configService.get('DB_HOST'));
        return {
          type: 'postgres',
          host: configService.get<string>('DATABASE_HOST'),
          port: parseInt(configService.get<string>('DATABASE_PORT') || '5432', 10),
          username: configService.get<string>('DATABASE_USER'),
          password:  configService.get<string>('DATABASE_PASSWORD'),
          database: configService.get<string>('DATABASE_NAME'),
          autoLoadEntities: true,
          synchronize: false,
        };
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User, Role, LeaveType, ShiftTiming]),
  ],
  controllers: [UserController, AuthController, LeaveTypeController, ShiftTimingController],
  providers: [UserService, AuthService, LeaveTypeService, ShiftTimingService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('user');
    consumer.apply(AuthMiddleware).forRoutes('leave-types');
    consumer.apply(AuthMiddleware).forRoutes('shift-timings');
  }
}