import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { ApiBody, ApiTags, ApiResponse } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiBody({ schema: { properties: { phone: { type: 'string' }, password: { type: 'string' } } } })
  @ApiResponse({ status: 201, description: 'User logged in successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  login(@Body() body: { phone: string, password: string }) {
    // Add user validity and generate access and refresh token 
    return this.authService.login(body.phone, body.password);
  }

  @Post('accessToken')
  @ApiBody({ schema: { properties: { refreshToken: { type: 'string' } } } })
  @ApiResponse({ status: 201, description: 'Access token generated successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  generateAccessToken(@Body() body: { refreshToken: string }) {
    return { accessToken: this.authService.generateAccessToken(body.refreshToken)};
  }
}