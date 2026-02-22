import { IsNotEmpty, IsNumber, IsDateString, IsOptional, IsString } from 'class-validator';

export class LeaveApplicationDto {
    @IsNotEmpty()
    @IsNumber()
    employee_id: number;

    @IsNotEmpty()
    @IsNumber()
    leave_type_id: number;

    @IsNotEmpty()
    @IsDateString()
    from_date: string;

    @IsNotEmpty()
    @IsDateString()
    to_date: string;

    @IsOptional()
    @IsString()
    reason?: string;

    @IsOptional()
    @IsString()
    duration?: string;
}
