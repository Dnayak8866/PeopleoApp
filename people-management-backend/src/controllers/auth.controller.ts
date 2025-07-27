import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() body: { phone: string, password: string }) {
    // Add user validity and generate access and refresh token 
    return this.authService.login(body.phone, body.password);
  }

  @Post('accessToken')
  generateAccessToken(@Body() body: { refreshToken: string }) {
    return { accessToken: this.authService.generateAccessToken(body.refreshToken)};
  }
}