import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private authService: AuthService,
  ) {}

  async getAllUsers(
    status?: number,
    limit = 10,
    offset = 0,
  ): Promise<{ data: User[]; total: number }> {
    const query = this.usersRepository.createQueryBuilder('user');

    if (status !== undefined) {
      query.where('user.status = :status', { status });
    }

    const [data, total] = await query
      .orderBy('user.createdAt', 'DESC')
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    return { data, total };
  }

  async addUser(createUserDto: CreateUserDto): Promise<User> {
    const { name, email, password } = createUserDto;

    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const encryptedPassword = await this.authService.hashPassword(password);

    const user = this.usersRepository.create({
      name,
      email,
      password: encryptedPassword,
      status: 1,
    });

    return await this.usersRepository.save(user);
  }

  async updateUser(updateUserDto: UpdateUserDto): Promise<User> {
    const { id, name, email, password } = updateUserDto;

    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    if (email && email !== user.email) {
      const existingUser = await this.usersRepository.findOne({
        where: { email },
      });
      if (existingUser) {
        throw new BadRequestException('Email already exists');
      }
      user.email = email;
    }

    if (name) {
      user.name = name;
    }

    if (password) {
      user.password = await this.authService.hashPassword(password);
    }

    return await this.usersRepository.save(user);
  }

  async login(loginDto: LoginDto): Promise<{
    authToken: string;
    user: { id: string; name: string; email: string };
  }> {
    const { email, password } = loginDto;

    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user) {
      throw new BadRequestException('Invalid email or password');
    }

    if (user.status === 0) {
      throw new BadRequestException('User account is inactive');
    }

    const isPasswordValid = await this.authService.validatePassword(
      user,
      password,
    );

    if (!isPasswordValid) {
      throw new BadRequestException('Invalid email or password');
    }

    const authToken = await this.authService.generateToken(user);

    return {
      authToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }

  async updateStatus(updateStatusDto: UpdateStatusDto): Promise<User> {
    const { id, status } = updateStatusDto;

    if (![0, 1].includes(status)) {
      throw new BadRequestException('Status must be 0 (inactive) or 1 (active)');
    }

    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    user.status = status;

    return await this.usersRepository.save(user);
  }

  async deleteUser(id: string): Promise<{ message: string }> {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    await this.usersRepository.remove(user);

    return { message: 'User deleted successfully' };
  }
}

