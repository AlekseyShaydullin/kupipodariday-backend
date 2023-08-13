import { CreateUserDto } from '../../users/dto/create-user.dto';
import { PickType } from '@nestjs/swagger';

export class SigningUserDto extends PickType(CreateUserDto, [
  'username',
  'password',
  'email',
] as const) {}
