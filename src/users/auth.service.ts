import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  async comparePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  async generateToken(user: User): Promise<string> {
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
    };

    return this.jwtService.signAsync(payload, {
      expiresIn: '7d',
    });
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    return await this.comparePassword(password, user.password);
  }
}
