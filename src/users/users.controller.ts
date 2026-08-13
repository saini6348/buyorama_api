import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { UsersService } from './users.service';
import { LoginDto } from './dto/login.dto';
import { Public } from '../auth/public.decorator';
@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('login')
  @Public()
  @HttpCode(200)
  async login(
    @Body() loginDto: LoginDto,
  ): Promise<{
    authToken: string;
    user: { id: string; name: string; email: string };
    message: string;
  }> {
    const result = await this.usersService.login(loginDto);
    return {
      ...result,
      message: 'Login successful',
    };
  }
}

