import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import User from 'src/database/entities/user.entity';
import { RegisterDto } from './class/authentication.dto';

@Injectable()
export class AuthenticationService {
  constructor(private readonly usersService: UsersService) {}

  public async register(body: RegisterDto): Promise<User> {
    const hashPassword = await bcrypt.hash(body.password, 10);
    try {
      return this.usersService.create({
        ...body,
        password: hashPassword,
      });
    } catch (err) {
      throw new BadRequestException();
    }
  }

  public async getAuthenticatedUser(
    email: string,
    planPassword: string,
  ): Promise<User> {
    const user = await this.usersService.getByEmail(email);
    const isPasswordMatching = await bcrypt.compare(
      planPassword,
      user.password,
    );
    if (!isPasswordMatching) {
      throw new BadRequestException('Wrong Password');
    }
    return user;
  }
}
