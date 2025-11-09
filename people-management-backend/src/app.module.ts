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

import { HolidayService } from './services/holiday.service';
import { Holiday } from './entities/holiday.entity';
import { HolidayController } from './controllers/holiday.controller';

import { DepartmentService } from './services/department.service';
import { Department } from './entities/department.entity';
import { DepartmentController } from './controllers/department.controller';

import { DesignationService } from './services/designation.service';
import { Designation } from './entities/designation.entity';
import { DesignationController } from './controllers/designation.controller';

import { AttendanceService } from './services/attendance.service';
import { AttendanceController } from './controllers/attendance.controller';
import { Attendance } from './entities/attendance.entity';
import { LeaveApplication } from './entities/leave-application.entity';

import { AuthMiddleware } from './middlewares/auth/auth.middleware';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { SalaryCountdownController } from './controllers/salary-countdown.controller';
import { SalaryCountdownService } from './services/salary-countdown.service';

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
  TypeOrmModule.forFeature([User, Role, LeaveType, ShiftTiming, Holiday, Department, Designation, Attendance, LeaveApplication]),
  ],

  controllers: [UserController, AuthController, LeaveTypeController, ShiftTimingController, HolidayController, DepartmentController, DesignationController, AttendanceController,SalaryCountdownController],
  providers: [UserService, AuthService, LeaveTypeService, ShiftTimingService, HolidayService, DepartmentService, DesignationService, AttendanceService,SalaryCountdownService],

})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('user');
    consumer.apply(AuthMiddleware).forRoutes('leave-types');
    consumer.apply(AuthMiddleware).forRoutes('shift-timings');
    consumer.apply(AuthMiddleware).forRoutes('holidays');
    consumer.apply(AuthMiddleware).forRoutes('departments');
    consumer.apply(AuthMiddleware).forRoutes('designations');
    consumer.apply(AuthMiddleware).forRoutes('attendance');
    consumer.apply(AuthMiddleware).forRoutes('salary-countdown');
  }
}