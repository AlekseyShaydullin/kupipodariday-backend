import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Wishlist } from './entities/wishlist.entity';
import { TUserRequest } from '../common/types';

@UseGuards(JwtAuthGuard)
@Controller('wishlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  // POST/wishlists
  @Post()
  create(
    @Request()
    { user }: TUserRequest,
    @Body()
    createWishlistDto: CreateWishlistDto,
  ): Promise<Wishlist> {
    return this.wishlistsService.createWishlist(createWishlistDto, user.id);
  }

  // GET/wishlists
  @Get()
  findAll(): Promise<Wishlist[]> {
    return this.wishlistsService.findAll();
  }

  // GET/wishlists/{id}
  @Get(':id')
  findOne(@Param('id') id: number): Promise<Wishlist> {
    return this.wishlistsService.findOne(id);
  }

  // PATCH/wishlists/{id}
  @Patch(':id')
  update(
    @Request()
    { user }: TUserRequest,
    @Param('id')
    id: number,
    @Body()
    updateWishlistDto: UpdateWishlistDto,
  ): Promise<Wishlist> {
    return this.wishlistsService.update(id, updateWishlistDto, user.id);
  }

  // DELETE/wishlists/{id}
  @Delete(':id')
  remove(
    @Request()
    { user }: TUserRequest,
    @Param('id')
    id: number,
  ): Promise<Wishlist> {
    return this.wishlistsService.remove(id, user.id);
  }
}
