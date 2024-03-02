import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Req,
  Request,
  Res,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { AuthService } from "./auth.service";
import { Request as ExpressRequest, Response } from "express";
import { ApiResponse, ApiResponseOptions } from "@scholarsome/shared";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import * as jwt from "jsonwebtoken";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcrypt";
import { MailService } from "../providers/mail/mail.service";
import { User } from "@prisma/client";
import { ApiExcludeController, ApiTags } from "@nestjs/swagger";
import { Throttle, ThrottlerGuard } from "@nestjs/throttler";
import { AuthenticatedGuard } from "./guards/authenticated.guard";
import { PrismaService } from "../providers/database/prisma/prisma.service";
import { RedisService } from "@liaoliaots/nestjs-redis";
import Redis from "ioredis";
import { DeleteApiKeyDto } from "./dto/deleteApiKey.dto";
import { CreateApiKeyDto } from "./dto/createApiKey.dto";
import { AccessTokenAuthenticatedGuard } from "./guards/accessTokenAuthenticated.guard";
import { AuthException } from "@api/shared/exception/exceptions/variants/auth.exception";
import { CommonException } from "@api/shared/exception/exceptions/variants/common.exception";
import { ResetEmailDto } from "./dto/resetEmail.dto";

@ApiTags("Authentication")
@ApiExcludeController()
@UseGuards(ThrottlerGuard)
@Controller("auth")
export class AuthController {
  private readonly apiKeyRedis: Redis;

  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService
  ) {
    this.apiKeyRedis = this.redisService.getClient("apiToken");
  }

  /*
   *
   * API key CRUD routes
   *
   */

  @UseGuards(AuthenticatedGuard)
  @Post("apiKey")
  async createApiKey(
    @Body() createApiKeyDto: CreateApiKeyDto,
    @Req() req: ExpressRequest
  ): Promise<ApiResponse<{ name: string; apiKey: string }>> {
    const user = await this.authService.getUserInfo(req);

    const apiKey = await this.prisma.apiKey.create({
      data: {
        name: createApiKeyDto.name,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    this.apiKeyRedis.set(
      apiKey.apiKey,
      JSON.stringify({
        id: user.id,
        email: user.email,
      })
    );

    return {
      status: ApiResponseOptions.Success,
      data: {
        name: createApiKeyDto.name,
        apiKey: apiKey.apiKey,
      },
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Delete("apiKey")
  async deleteAPIKey(
    @Body() deleteApiKeyDto: DeleteApiKeyDto,
    @Req() req: ExpressRequest
  ): Promise<ApiResponse<{ apiKey: string }>> {
    const apiKey = await this.prisma.apiKey.findUnique({
      where: {
        apiKey: deleteApiKeyDto.apiKey,
      },
    });
    if (!apiKey) throw new AuthException.ApiKeyNotFound();

    await this.prisma.apiKey.delete({
      where: {
        apiKey: deleteApiKeyDto.apiKey,
      },
    });

    this.apiKeyRedis.del(deleteApiKeyDto.apiKey);

    return {
      status: ApiResponseOptions.Success,
      data: null,
    };
  }

  /*
   *
   * Password reset routes
   *
   */

  /**
   * Changes the email of an authenticated user
   *
   * @returns Updated User object
   */
  @Post("reset/email/set")
  async resetEmail(
    @Body() resetPasswordDto: ResetEmailDto,
    @Res({ passthrough: true }) res: Response,
    @Req() req: ExpressRequest
  ): Promise<ApiResponse<User>> {
    const user = await this.authService.getUserInfo(req);
    if (!user) throw new UnauthorizedException({ status: "fail", message: "Invalid authentication to access the requested resource" });

    const updatedUser = await this.usersService.updateUser({
      where: {
        id: user.id
      },
      data: {
        email: resetPasswordDto.newEmail
      }
    });

    if (req.cookies["access_token"]) await this.authService.logout(req, res);

    delete updatedUser.password;
    delete updatedUser.verified;
    delete updatedUser.email;

    return {
      status: ApiResponseOptions.Success,
      data: updatedUser
    };
  }

  /**
   * Resets the password of a user after checking for a valid reset token in their cookies.
   *
   * @returns Updated User object
   */
  @Post("reset/password/set")
  async setPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
    @Res({ passthrough: true }) res: Response,
    @Req() req: ExpressRequest
  ): Promise<ApiResponse<User>> {
    let email = "";

    if (req.cookies["resetPasswordToken"]) {
      let decoded: { email: string; forPasswordReset: boolean };

      try {
        decoded = jwt.verify(
            req.cookies["resetPasswordToken"],
            this.configService.get<string>("JWT_SECRET")
        ) as { email: string; forPasswordReset: boolean };
      } catch (e) {
        res.status(401);

        throw new AuthException.InvalidResetTokenProvided();
      }
      
      res.cookie("resetPasswordToken", "", {
        httpOnly: false,
        expires: new Date()
      });

      email = decoded.email;
    } else if (resetPasswordDto.existingPassword) {
      const userCookie = await this.authService.getUserInfo(req);
      if (!userCookie) throw new UnauthorizedException({ status: "fail", message: "Invalid authentication to access the requested resource" });

      const user = await this.usersService.user({ id: userCookie.id });
      if (!user) throw new NotFoundException({ status: "fail", message: "User not found" });

      email = user.email;

      if (!bcrypt.compareSync(resetPasswordDto.existingPassword, user.password)) throw new UnauthorizedException({ status: "fail", message: "Invalid authentication to access the requested resource" });
    } else {
      throw new UnauthorizedException({ status: "fail", message: "Invalid authentication to access the requested resource" });
    }

    const updatedUser = await this.usersService.updateUser({
      where: {
        email: email
      },
      data: {
        password: await bcrypt.hash(resetPasswordDto.newPassword, 10)
      }
    });


    delete updatedUser.password;
    delete updatedUser.verified;
    delete updatedUser.email;

    return {
      status: ApiResponseOptions.Success,
      data: updatedUser
    };
  }

  /**
   * Adds a reset token in cookies that can be used in the /api/auth/reset/password route to reset a password.
   *
   * @remarks This is the link that is emailed to users when a password reset is requested.
   * @returns Void, redirect to /api/auth/redirect
   */
  @Get("reset/password/verify/:token")
  async verifyPasswordResetRequest(
    @Param() params: { token: string },
    @Res() res: Response
  ): Promise<void> {
    let decoded: { email: string; forPasswordReset: boolean };
    try {
      decoded = jwt.verify(
          params.token,
          this.configService.get<string>("JWT_SECRET")
      ) as { email: string; forPasswordReset: boolean };
    } catch (e) {
      return res.redirect("/");
    }

    if (decoded && decoded.forPasswordReset) {
      res.cookie("resetPasswordToken", params.token, {
        httpOnly: false,
        expires: new Date(new Date().setMinutes(new Date().getMinutes() + 10))
      });
    }

    return res.redirect("/");
  }

  /**
   * Sends a password reset for a given user
   *
   * @remarks Throttled to 1 request per 5 seconds
   * @returns Success response
   */
  @Throttle(1, 5)
  @Get("reset/password/send/:email")
  async sendPasswordReset(
    @Param() params: { email: string }
  ): Promise<ApiResponse<null>> {
    const user = await this.usersService.user({ email: params.email });

    if (user) await this.mailService.sendPasswordReset(params.email);

    return {
      status: ApiResponseOptions.Success,
      data: null,
    };
  }

  /*
   *
   * Registration routes
   *
   */

  /**
   * Verifies a users email given a successfully validated token
   *
   * @remarks This is the link that users click on to verify their email
   * @returns Void, redirect to '/homepage'
   */
  @Get("verify/email/:token")
  async verifyEmail(@Param() params: { token: string }, @Res() res: Response) {
    let email: { email: string };

    try {
      email = jwt.verify(
        params.token,
        this.configService.get<string>("JWT_SECRET")
      ) as { email: string };
    } catch (e) {
      throw new AuthException.InvalidEmailVerificationTokenProvided();
    }

    const verification = await this.usersService.updateUser({
      where: {
        email: email.email,
      },
      data: {
        verified: true,
      },
    });

    if (verification) {
      res.cookie("verified", true, {
        expires: new Date(new Date().setSeconds(new Date().getSeconds() + 30)),
      });
    } else {
      res.cookie("verified", false, { expires: new Date() });
    }

    const user = await this.usersService.user({ email: email.email });
    if (!user) res.redirect("/");

    this.authService.setLoginCookies(res, user);

    return res.redirect("/homepage");
  }

  /**
   * Resends the verification email to the user
   *
   * @returns Success response
   */
  @Post("resendVerification")
  async resendVerificationMail(
    @Request() req: ExpressRequest
  ): Promise<ApiResponse<null>> {
    const userCookie = await this.authService.getUserInfo(req);

    const user = await this.usersService.user({ id: userCookie.id });

    if (user) {
      if (await this.mailService.sendEmailConfirmation(user.email)) {
        return {
          status: ApiResponseOptions.Success,
          data: null,
        };
      } else {
        throw new CommonException.InternalServerError(
          "Could not send verification email."
        );
      }
    } else {
      throw new CommonException.InternalServerError();
    }
  }

  /**
   * Registers a new user
   *
   * @remarks Throttled to 1 request per 5 seconds
   * @returns Success response
   */
  @Throttle(1, 5)
  @Post("register")
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<ApiResponse<null>> {
    if (
      (await this.usersService.user({ email: registerDto.email })) ||
      (await this.usersService.user({ username: registerDto.username }))
    ) {
      res.status(409);

      throw new AuthException.EmailAlreadyExists();
    } else {
      const user = await this.usersService.createUser({
        username: registerDto.username,
        email: registerDto.email,
        password: await bcrypt.hash(registerDto.password, 10),
        verified: !this.configService.get<boolean>("SMTP_HOST"),
      });

      await this.mailService.sendEmailConfirmation(registerDto.email);
      this.authService.setLoginCookies(res, user);

      return {
        status: ApiResponseOptions.Success,
        data: null,
      };
    }
  }

  /*
   *
   * Login routes
   *
   */

  /**
   * Logs a user in and sets relevant cookies
   *
   * @returns Success response
   */
  @HttpCode(200)
  @Post("login")
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<ApiResponse<null>> {
    if (
      !(await this.authService.validateUser(loginDto.email, loginDto.password))
    ) {
      res.status(401);

      throw new AuthException.InvalidCredentials();
    }

    if (this.configService.get<string>("SCHOLARSOME_RECAPTCHA_SECRET")) {
      const captchaCheck = await this.authService.validateRecaptcha(
        loginDto.recaptchaToken
      );
      if (!captchaCheck) {
        throw new CommonException.TooManyRequests();
      }
    }

    const user = await this.usersService.user({
      email: loginDto.email,
    });

    if (!user) {
      res.status(500);

      throw new AuthException.UserDoesNotExist();
    }

    this.authService.setLoginCookies(res, user);

    return {
      status: ApiResponseOptions.Success,
      data: null,
    };
  }

  /**
   * Logs a user out and removes relevant cookies
   *
   * @returns Void
   */
  @Post("logout")
  logout(
    @Req() req: ExpressRequest,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.logout(req, res);
  }
}
