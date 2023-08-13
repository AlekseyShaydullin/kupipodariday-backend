import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly aythService: AuthService) {
    super();
  }

  async validate(username: string, passward: string) {
    const user = await this.aythService.validateUser(username, passward);

    if (!user) {
      throw new UnauthorizedException(
        'Некорректное имя пользователя или пароль',
      );
    }

    return user;
  }
}
