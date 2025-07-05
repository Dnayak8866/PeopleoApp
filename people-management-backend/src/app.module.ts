import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',      // your DB user
      password: '123456',      // your DB password
      database: 'PeopleO', // your DB name
      autoLoadEntities: true,
      synchronize: true,         // auto-create tables in dev
    }),
    TypeOrmModule.forFeature([User, Role]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class AppModule {}