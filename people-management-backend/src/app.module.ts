import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';

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
    UsersModule,
    RolesModule,
  ],
})
export class AppModule {}