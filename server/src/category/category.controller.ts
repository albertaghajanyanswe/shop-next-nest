import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CategoryDto, GetCategoryDto, GetCategoryDtoAndCount } from './dto/category.dto';
import { ApiOkResponse } from '@nestjs/swagger';
import { CurrentUser } from 'src/user/decorators/user.decorator';
import type { User } from '@prisma/client';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Auth()
  @Get('by-storeId/:storeId')
  @ApiOkResponse({ type: GetCategoryDto, isArray: true })
  async getByStoreId(@Param('storeId') storeId: string) {
    return this.categoryService.getByStoreId(storeId);
  }

  @Get('')
  @ApiOkResponse({ type: GetCategoryDtoAndCount })
  async getAll(@Query('params') params?: string) {
    return this.categoryService.getAll(params);
  }

  @Get('by-id/:id')
  @ApiOkResponse({ type: GetCategoryDto })
  async getById(@Param('id') id: string) {
    return this.categoryService.getById(id);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Post(':storeId')
  @ApiOkResponse({ type: GetCategoryDto })
  async create(
    @CurrentUser('id') userId: string,
    @Param('storeId') storeId: string,
    @Body() dto: CategoryDto,
  ) {
    return this.categoryService.create(userId, storeId, dto);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Put(':id')
  @ApiOkResponse({ type: GetCategoryDto })
  async update(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() dto: CategoryDto,
  ) {
    return this.categoryService.update(user, id, dto);
  }

  @HttpCode(200)
  @Auth()
  @Delete(':id')
  @ApiOkResponse({ type: GetCategoryDto })
  async delete(@CurrentUser() user: User, @Param('id') id: string) {
  return this.categoryService.delete(user, id);
  }
}
