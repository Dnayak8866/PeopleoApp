import { Body, Controller, Post, Get, Request, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { ApiBody, ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { LoginRequestDto, LoginResponseDto } from '../dto/login.dto';
import { HomePageDetailsDto } from '../dto/home-page.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  @ApiBody({ type: LoginRequestDto })
  @ApiResponse({ status: 201, description: 'User logged in successfully.', type: LoginResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async login(@Body() loginDto: LoginRequestDto): Promise<LoginResponseDto> {
    return this.authService.login(loginDto.phone, loginDto.password);
  }

  @Post('accessToken')
  @ApiBody({ schema: { properties: { refreshToken: { type: 'string' } } } })
  @ApiResponse({ status: 201, description: 'Access token generated successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  generateAccessToken(@Body() body: { refreshToken: string }) {
    return { accessToken: this.authService.generateAccessToken(body.refreshToken) };
  }

  @Post('home-page-details')
  @ApiBody({ schema: { properties: { userId: { type: 'number', example: 1 }, companyId: { type: 'number', example: 1 } } } })
  @ApiResponse({ status: 200, description: 'Home page details fetched successfully.', type: HomePageDetailsDto })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getHomePageDetails(@Body() body: { userId: number; companyId: number }): Promise<HomePageDetailsDto> {
    return this.authService.getHomePageDetails(body.userId, body.companyId);
  }

  @Post('reset-password')
  @ApiBody({ schema: { properties: { userId: { type: 'number', example: 1 }, currentPassword: { type: 'string' }, newPassword: { type: 'string' } } } })
  @ApiResponse({ status: 200, description: 'Password reset successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async resetPassword(@Body() body: { userId: number; currentPassword: string; newPassword: string }) {
    return this.authService.resetPassword(body.userId, body.currentPassword, body.newPassword);
  }
}