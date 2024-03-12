import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { RecaptchaResponse, User as UserWithSets } from '@scholarsome/shared';
import { RedisService } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { User } from '@prisma/client';
import * as crypto from 'crypto';
import { AccessTokenPayload } from '../types/token-payload.interface';
import { JwtPayload } from 'jwt-decode';
import { TokenUser } from '../types/token-user.interface';
import { TokenService } from './token.service';
import { TokenType } from '../types/token-type.enum';

@Injectable()
export class AuthService {
  private readonly refreshTokenRedis: Redis;
  private readonly apiKeyRedis: Redis;

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
    private readonly tokenService: TokenService
  ) {
    this.refreshTokenRedis = this.redisService.getClient('default');
    this.apiKeyRedis = this.redisService.getClient('apiToken');
  }

  /**
   * Decodes the access token JWT
   *
   * @param req User's `Request` object
   *
   * @returns Decoded access token
   */
  async getUserInfo(req: Request): Promise<TokenUser | null> {
    if (req.cookies['access_token']) {
      try {
        const payload = await this.jwtService.verifyAsync(
          req.cookies['access_token']
        );
        if (typeof payload.sub !== 'string' || typeof payload.rti !== 'string')
          throw new UnauthorizedException('Invalid access token provided.');

        return { id: payload.sub };
      } catch (e) {
        return null;
      }
    } else if (req.header('x-api-key')) {
      const id = await this.apiKeyRedis.get(req.header('x-api-key'));

      if (!id) throw new UnauthorizedException('Invalid API key provided.');

      return { id };
    }

    return null;
  }

  /**
   * Validates whether a recaptcha token passes a score of >= 0.5
   *
   * @param token Generated client-side recaptcha token
   * @returns Result of whether token is >= 0.5
   */
  async validateRecaptcha(token: string): Promise<boolean> {
    const body = {
      secret: this.configService.get<string>('RECAPTCHA_SECRET'),
      response: token,
    };

    const googleRes = await lastValueFrom(
      this.httpService.post<RecaptchaResponse>(
        'https://www.google.com/recaptcha/api/siteverify',
        new URLSearchParams(Object.entries(body)).toString(),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }
      )
    );

    if (googleRes.data['error-codes']) return false;

    return googleRes.data.score >= 0.5;
  }

  /**
   * Validates whether a user's input password matches the hashed database version
   *
   * @param password Entered password
   * @param hash Password hash from the database
   * @returns Whether the user's password matches their hashed password
   */
  async comparePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  /**
   * Sets the response login cookies for the user
   */
  public async setLoginCookies(
    res: Response,
    user: UserWithSets | User
  ): Promise<void> {
    res.cookie('verified', user.verified, { httpOnly: false });

    const { refreshToken, accessToken, jti } =
      await this.tokenService.issueTokenPair(user.id);

    res.cookie(TokenType.RefreshToken, refreshToken, {
      httpOnly: true,
    });
    this.refreshTokenRedis.sadd(user.id, jti);

    res.cookie(TokenType.AccessToken, accessToken);
    res.cookie('authenticated', true, {
      httpOnly: false,
    });
  }

  /**
   * Logs a user out
   */
  async logout(req: Request, res: Response) {
    const user: AccessTokenPayload = await this.jwtService.verifyAsync(
      req.cookies.access_token
    );
    await this.refreshTokenRedis.srem(user.sub);

    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    res.clearCookie('authenticated');
  }
}
