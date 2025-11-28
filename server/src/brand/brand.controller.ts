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
import { BrandService } from './brand.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { BrandDto, GetBrandDto, GetBrandDtoAndCount } from './dto/brand.dto';
import { ApiOkResponse } from '@nestjs/swagger';
import { CurrentUser } from 'src/user/decorators/user.decorator';
import type { User } from '@prisma/client';

@Controller('brands')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Get('')
  @ApiOkResponse({
    type: GetBrandDtoAndCount,
  })
  async getAll(@Query('params') params?: string) {
    return this.brandService.getAll(params);
  }

  @Auth()
  @Get('by-storeId/:storeId')
  @ApiOkResponse({
    type: GetBrandDto,
    isArray: true,
  })
  async getByStoreId(@Param('storeId') storeId: string) {
    return this.brandService.getByStoreId(storeId);
  }

  @Get('by-id/:id')
  @ApiOkResponse({ type: GetBrandDto })
  async getById(@Param('id') id: string) {
    return this.brandService.getById(id);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Post(':storeId')
  @ApiOkResponse({ type: GetBrandDto })
  async create(
    @CurrentUser('id') userId: string,
    @Param('storeId') storeId: string,
    @Body() dto: BrandDto,
  ) {
    return this.brandService.create(userId, storeId, dto);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Put(':id')
  @ApiOkResponse({ type: GetBrandDto })
  async update(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() dto: BrandDto,
  ) {
    return this.brandService.update(user, id, dto);
  }

  @HttpCode(200)
  @Auth()
  @Delete(':id')
  @ApiOkResponse({ type: GetBrandDto })
  async delete(@CurrentUser() user: User, @Param('id') id: string) {
    return this.brandService.delete(user, id);
  }
}
