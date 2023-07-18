import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

// @UseGuards(JwtAuthGuard) PROTEGER RUTAS ALL CONTROLLER
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() userObject: CreateAuthDto) {
    return this.authService.register(userObject);
  }

  @Post('login')
  login(@Body() userObjectLogin: LoginAuthDto) {
    return this.authService.login(userObjectLogin);
  }

  @Get('email')
  sendPlainTextEmail(@Query('toEmail') toEmail: string) {
    return this.authService.sendEmailToResetPassword(toEmail);
  }

  @Get('renew')
  refreshToken(@Query('token') token: string) {
    return this.authService.refreshToken(token);
  }

  @Patch()
  update(@Body() userObject: UpdateAuthDto) {
    return this.authService.resetPassword(userObject);
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(id);
  }
}
