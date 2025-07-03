import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { Users } from './entities/users.entity';
import { Roles } from './entities/roles.entity';

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
    TypeOrmModule.forFeature([Users, Roles]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class AppModule {}