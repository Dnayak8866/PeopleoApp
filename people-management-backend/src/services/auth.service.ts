import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../services/user.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UserService, 
  ) {}

  // Step 1: Validate user creds
  async validateUser(phone: string, password: string) {
    const user = await this.usersService.findByPhone(phone);
    if (!user) {
      throw new UnauthorizedException('No user found');
    }else if(!await bcrypt.compare(password, user.password)) {
      throw new UnauthorizedException('Invalid Credentials');
    }
    return user;
  }
  
  //Step 2: Generate Refresh Token
  generateRefreshToken(phone: string, userId: number) {
    const payload = { sub: userId, phone: phone};
    console.log('Payload for Refresh Token: ', payload);
    const refreshToken = this.jwtService.sign(
      payload,
      {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '1D',
      }
    );
    console.log('Refresh Token: ', refreshToken);
    console.log('process.env.JWT_REFRESH_SECRET: ', process.env.JWT_REFRESH_SECRET);
    return refreshToken;
  }

  //Step 3: Generate access Token
  generateAccessToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
      console.log('Payload: ', payload);
      const accessToken = this.jwtService.sign(
        { sub: payload.sub },
        {
          secret: process.env.JWT_ACCESS_SECRET,
          expiresIn: '5m',
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

  // Final Login API
  async login(phone: string, password: string) {
    const user = await this.validateUser(phone, password);
    const refreshToken = this.generateRefreshToken(user.phoneNumber,  user.id);
    console.log('Refresh Token: ', refreshToken);
    const accessToken = this.generateAccessToken(refreshToken);
    return {
      refreshToken,
      accessToken,
    };
  }
}
