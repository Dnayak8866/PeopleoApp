// src/middlewares/auth.middleware.ts
import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    // 1. Get the 'Authorization' header
    const authHeader = req.headers['authorization'];

    // 2. Check if token is present and has the format 'Bearer <token>'
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No token provided or invalid format');
    }

    // 3. Extract the token string (removes 'Bearer ')
    const token = authHeader.split(' ')[1];
    console.log('token: ', token);
    console.log('Access secret key: ', process.env.JWT_ACCESS_SECRET);
    try {
      // 4. Verify the token using the secret
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_ACCESS_SECRET,
      });

      // 5. Attach payload to request so other parts (controllers, services) can use it
      req['user'] = payload;

      // 6. Continue to the next middleware or route handler
      next();
    } catch (error) {
      // 7. Token invalid or expired
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
