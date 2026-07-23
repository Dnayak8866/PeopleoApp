import { IsString, IsNotEmpty, Matches, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginRequestDto {
    @ApiProperty({
        description: 'Phone number of the user',
        example: '1234567890',
    })
    @IsString()
    @IsNotEmpty()
    @Matches(/^\d{10}$/, { message: 'Phone number must be exactly 10 digits' })
    phone: string;

    @ApiProperty({
        description: 'Password/PIN of the user',
        example: '123456',
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(6, { message: 'Password must be at least 6 characters' })
    password: string;
}

export class UserDetailsDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    fullName: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    phoneNumber: string;

    @ApiProperty()
    roleId: number;

    @ApiProperty()
    departmentId: number;

    @ApiProperty()
    designationId: number;

    @ApiProperty()
    employeeCode: string;

    @ApiProperty()
    companyId: number;

    @ApiProperty({ required: false })
    avatar?: string;
}

export class LoginResponseDto {
    @ApiProperty()
    accessToken: string;

    @ApiProperty()
    refreshToken: string;
}
