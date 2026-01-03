import { ApiProperty } from '@nestjs/swagger';
import { UserDetailsDto } from './login.dto';

export class CompanyDetailsDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    name: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    contactNumber: string;

    @ApiProperty()
    address: string;
}

export class MasterDataDto {
    @ApiProperty()
    roles: any[];

    @ApiProperty()
    departments: any[];

    @ApiProperty()
    designations: any[];

    @ApiProperty()
    leaveTypes: any[];

    @ApiProperty()
    shiftTimings: any[];
}

export class HomePageDetailsDto {
    @ApiProperty({ type: UserDetailsDto })
    user: UserDetailsDto;

    @ApiProperty({ type: CompanyDetailsDto })
    company: CompanyDetailsDto;

    @ApiProperty({ type: MasterDataDto })
    masterData: MasterDataDto;
}
