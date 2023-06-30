import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

class PhoneDto {
  public phone: string;
}

class GetTokenDto {
  public phone: string;
  public code: string;
  public sms: string;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('phone')
  async phone(@Body() dto: PhoneDto) {
    return this.authService.getCode(dto.phone);
  }

  @Post('token')
  async token(@Body() dto: GetTokenDto) {
    return this.authService.getToken(dto.phone, dto.sms, dto.code);
  }
}
