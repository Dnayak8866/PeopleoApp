import { IsEmail, IsNotEmpty, IsString, IsNumber, IsBoolean, IsDate, IsInt } from 'class-validator';

export class CreateUsersDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  jobTitle: string;

  @IsNumber()
  phone: number;

  @IsEmail()
  email: string;

  @IsString()
  gender: string;

  @IsDate()
  dob: Date;

  @IsDate()
  joiningDate: Date;

  @IsInt()
  roleId: number; // references Role.id

  @IsString()
  AddressLine1: string;

  @IsString()
  AddressLine2: string;

  @IsString()
  City: string;

  @IsString()
  State: string;

  @IsString()
  Country: string;

  @IsString()
  Zipcode: string;

  @IsString()
  AadharNumber: string;

  @IsString()
  PANNumber: string;

  @IsBoolean()
  isDeleted: boolean;

}