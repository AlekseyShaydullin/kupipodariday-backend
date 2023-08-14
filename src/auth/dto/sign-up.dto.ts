import { PickType } from '@nestjs/swagger';
import { CreateUserDto } from '../../users/dto/create-user.dto';

export class SigningUserDto extends PickType(CreateUserDto, [
  'username',
  'password',
  'email',
] as const) {}
