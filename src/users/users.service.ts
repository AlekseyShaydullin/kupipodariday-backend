import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { HashService } from '../hash/hash.service';
import { Wish } from 'src/wishes/entities/wish.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
    private readonly hashService: HashService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { email, username } = createUserDto;
    const isExist = await this.userRepository.findOne({
      where: [{ email }, { username }],
    });

    if (isExist) throw new UnauthorizedException(`Пользователь уже существует`);

    const newUser = this.userRepository.create({
      ...createUserDto,
      password: this.hashService.getHash(createUserDto.password),
    });
    return await this.userRepository.save(newUser);
  }

  async findOne(query: FindOneOptions<User>): Promise<User> {
    return await this.userRepository.findOne(query);
  }
  async findOneById(id: number): Promise<User> {
    return await this.userRepository.findOneBy({ id });
  }

  async findByEmailOrUserName(query: string): Promise<User[]> {
    return await this.userRepository.find({
      where: [{ username: query }, { email: query }],
    });
  }

  async findUserWishes(id: number): Promise<Wish[]> {
    const wishes = await this.wishRepository.find({
      where: { owner: { id } },
    });
    return wishes;
  }

  async updateById(id: number, updateUserDto: UpdateUserDto) {
    const { email, username, password } = updateUserDto;
    const user = await this.findOne({ where: { id } });

    if (email) {
      const emailOwner = await this.findOne({ where: { email } });
      if (emailOwner && emailOwner.id != id) {
        throw new ConflictException(`Эта почта уже используется`);
      }
    }

    if (username) {
      const usernameOwner = await this.findOne({ where: { username } });
      if (usernameOwner && usernameOwner.id != id) {
        throw new ConflictException(`Это имя уже используется`);
      }
    }

    if (password) {
      const passHash = this.hashService.getHash(updateUserDto.password);
      updateUserDto.password = passHash;
    }

    const updateUser = { ...user, ...updateUserDto };

    await this.userRepository.update({ id }, updateUser);
    return this.findOne({ where: { id } });
  }

  async removeById(id: number) {
    await this.userRepository.delete(id);
  }
}
