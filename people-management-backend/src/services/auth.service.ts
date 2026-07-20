import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../services/user.service';
import { CompanyService } from '../services/company.service';
import { RoleService } from '../services/role.service';
import { DepartmentService } from '../services/department.service';
import { DesignationService } from '../services/designation.service';
import { LeaveTypeService } from '../services/leave-type.service';
import { ShiftTimingService } from '../services/shift-timing.service';
import { LoginResponseDto, UserDetailsDto } from '../dto/login.dto';
import { HomePageDetailsDto, CompanyDetailsDto, MasterDataDto } from '../dto/home-page.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UserService,
    private companyService: CompanyService,
    private roleService: RoleService,
    private departmentService: DepartmentService,
    private designationService: DesignationService,
    private leaveTypeService: LeaveTypeService,
    private shiftTimingService: ShiftTimingService,
  ) { }

  async validatePhone(phone: string) {
    const user = await this.usersService.findByPhone(phone);
    if (!user) {
      throw new UnauthorizedException('Phone number not found');
    }
    return user;
  }

  async validatePassword(user: any, password: string) {
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }
    return true;
  }

  async validateUser(phone: string, password: string) {
    const user = await this.validatePhone(phone);
    // await this.validatePassword(user, password);

    return user;
  }

  generateRefreshToken(phone: string, userId: number, companyId: number) {
    const payload = { sub: userId, phone: phone, companyId: companyId };
    const refreshToken = this.jwtService.sign(
      payload,
      {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '1D',
      }
    );
    return refreshToken;
  }

  generateAccessToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
      const accessToken = this.jwtService.sign(
        { sub: payload.sub, companyId: payload.companyId },
        {
          secret: process.env.JWT_ACCESS_SECRET,
          expiresIn: '1D',
        }
      );

      return accessToken;
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Refresh token has expired');
      }
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private mapUserToDto(user: any): UserDetailsDto {
    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      roleId: user.roleId,
      departmentId: user.departmentId,
      designationId: user.designationId,
      employeeCode: user.employeeCode,
      companyId: user.companyId,
      avatar: user.avatar || null,
    };
  }

  async login(phone: string, password: string): Promise<LoginResponseDto> {
    const user = await this.validateUser(phone, password);
    const refreshToken = this.generateRefreshToken(user.phoneNumber, user.id, user.companyId);
    const accessToken = this.generateAccessToken(refreshToken);
    return {
      refreshToken,
      accessToken,
    };
  }

  async getHomePageDetails(userId: number, companyId: number): Promise<HomePageDetailsDto> {
    try {
      const user = await this.usersService.findOne(userId);
      const company = await this.companyService.findOne(companyId);

      const [roles, departments, designations, leaveTypes, shiftTimings] = await Promise.all([
        this.roleService.findAll(),
        this.departmentService.findAll(companyId),
        this.designationService.findAll(companyId),
        this.leaveTypeService.findAll(companyId),
        this.shiftTimingService.findAll(companyId),
      ]);

      const companyDetails: CompanyDetailsDto = {
        id: company.id,
        name: company.name,
        email: company.email,
        contactNumber: company.contactNumber,
        address: company.address,
      };

      const masterData: MasterDataDto = {
        roles,
        departments,
        designations,
        leaveTypes,
        shiftTimings,
      };

      return {
        user: this.mapUserToDto(user),
        company: companyDetails,
        masterData,
      };
    } catch (error) {
      console.error('Error fetching home page details:', error);
      throw error;
    }
  }
}
