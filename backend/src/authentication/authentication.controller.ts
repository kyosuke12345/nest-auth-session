import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import { AuthenticationService } from './authentication.service';
import { RegisterDto } from './class/authentication.dto';
import RequestWithUser from './class/authentication.interface';
import { CookieAuthenticationGuard } from './cookieAuthentication.guard';
import { LoginWithCredentialsGuard } from './logInWithCredentialsGuard';

class LoginDto {
  @ApiProperty()
  email: string;
  @ApiProperty()
  password: string;
}

@ApiTags('認証')
@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticatoinService: AuthenticationService) {}

  @HttpCode(200)
  @UseGuards(CookieAuthenticationGuard)
  @Post('log-out')
  async logOut(@Req() request: RequestWithUser) {
    request.logOut();
    request.session.cookie.maxAge = 0;
  }

  @ApiOperation({
    description: 'Userの登録処理',
  })
  @Post('register')
  async register(@Body() body: RegisterDto) {
    return this.authenticatoinService.register(body);
  }

  @ApiOperation({
    description: 'Userのログイン処理',
  })
  @ApiBody({
    type: LoginDto,
  })
  @HttpCode(200)
  @UseGuards(LoginWithCredentialsGuard)
  @Post('login')
  async login(@Req() request: RequestWithUser) {
    return request.user;
  }

  @ApiOperation({ description: 'ユーザ情報取得' })
  @UseGuards(CookieAuthenticationGuard)
  @Get()
  async authenticate(@Req() request: RequestWithUser) {
    return request.user;
  }
}
