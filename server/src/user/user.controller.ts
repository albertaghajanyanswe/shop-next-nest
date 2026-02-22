import { Body, Controller, Get, HttpCode, Param, Patch, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from './decorators/user.decorator';
import { ApiOkResponse, ApiResponse } from '@nestjs/swagger';
import { GetUserDto, UpdateUserDto } from './dto/user.dto';
import type { User } from '@prisma/client';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Auth()
  @Get('profile')
  @ApiResponse({ type: GetUserDto })
  async getProfile(@CurrentUser('id') id: string) {
    return this.userService.getById(id);
  }

  @Auth()
  @Patch('profile/favorites/:productId')
  async toggleFavorite(
    @CurrentUser('id') userId: string,
    @Param('productId') productId: string,
  ) {
    return this.userService.toggleFavorite(productId, userId);
  }

  @HttpCode(200)
  @Auth()
  @Put()
  @ApiOkResponse({ type: GetUserDto })
  async update(@CurrentUser() user: User, @Body() dto: UpdateUserDto) {
    return this.userService.update(user, dto);
  }
}
