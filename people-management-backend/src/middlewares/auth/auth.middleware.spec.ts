import { AuthMiddleware } from './auth.middleware';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthMiddleware', () => {
  let middleware: AuthMiddleware;
  let jwtService: JwtService;

  const mockJwtService = {
    verify: jest.fn(),
  };

  const mockRequest = (authHeader?: string) => ({
    headers: {
      authorization: authHeader || '',
    },
  });

  const mockResponse = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
  };

  const next = jest.fn();

  beforeEach(() => {
    jwtService = mockJwtService as any;
    middleware = new AuthMiddleware(jwtService);
    jest.clearAllMocks();
  });

  it('should call next() if token is valid', () => {
    const tokenPayload = { sub: 1, phone: '1234567890' };
    mockJwtService.verify.mockReturnValue(tokenPayload);

    const req = mockRequest('Bearer valid.token.here');
    const res = mockResponse();

    middleware.use(req as any, res, next);

    expect(mockJwtService.verify).toHaveBeenCalledWith('valid.token.here', {
      secret: process.env.ACCESS_SECRET_KEY,
    });

    expect(req['user']).toEqual(tokenPayload);
    expect(next).toHaveBeenCalled();
  });

  it('should throw UnauthorizedException if token is missing', () => {
    const req = mockRequest();
    const res = mockResponse();

    expect(() => middleware.use(req as any, res, next)).toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException if token is invalid', () => {
    mockJwtService.verify.mockImplementation(() => {
      throw new Error('Invalid token');
    });

    const req = mockRequest('Bearer invalid.token');
    const res = mockResponse();

    expect(() => middleware.use(req as any, res, next)).toThrow(UnauthorizedException);
  });
});
