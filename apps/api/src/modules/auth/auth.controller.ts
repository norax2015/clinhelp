import { Controller, Post, Get, Body, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  login(@Body() dto: LoginDto, @Request() req: any) {
    dto.ipAddress = req.ip;
    dto.userAgent = req.headers['user-agent'];
    return this.authService.login(dto);
  }

  @ApiBearerAuth()
  @Get('me')
  getProfile(@CurrentUser('sub') userId: string) {
    return this.authService.getProfile(userId);
  }
}
